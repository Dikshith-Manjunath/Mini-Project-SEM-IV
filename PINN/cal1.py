import deepxde as dde
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import tensorflow as tf

# Set random seed for reproducibility
np.random.seed(1234)
tf.random.set_seed(1234)

# Constants
G = 6.67430e-11  # Gravitational constant (m³/kg/s²)
M_earth = 5.972e24  # Earth's mass (kg)
R_earth = 6371000  # Earth's radius (m)
mu = G * M_earth  # Standard gravitational parameter

# Spacecraft parameters
mass = 15000  # kg
thrust = 300000  # N
cross_section_area = 10  # m²
drag_coefficient = 0.2

# Atmospheric model (simple exponential model)
def atmospheric_density(altitude):
    h0 = 7500  # Scale height (m)
    rho0 = 1.225  # Sea level density (kg/m³)
    return rho0 * tf.exp(-altitude / h0)

# Calculate altitude from position vector
def calculate_altitude(x, y, z):
    r = tf.sqrt(x**2 + y**2 + z**2)
    return r - R_earth

# PDE definition
def pde(x, y):
    """Define the PDE system for orbital dynamics.
    
    Args:
        x: The input variable, which includes time.
        y: The output variable, which includes position (x,y,z) and velocity (vx,vy,vz).
    """
    # Time
    t = x[:, 0:1]
    
    # Position and velocity components
    rx, ry, rz = y[:, 0:1], y[:, 1:2], y[:, 2:3]
    vx, vy, vz = y[:, 3:4], y[:, 4:5], y[:, 5:6]
    
    # Position vector magnitude
    r_mag = tf.sqrt(rx**2 + ry**2 + rz**2)
    
    # Velocity vector magnitude
    v_mag = tf.sqrt(vx**2 + vy**2 + vz**2)
    
    # Unit vectors
    r_unit = tf.stack([rx, ry, rz], axis=1) / r_mag
    v_unit = tf.stack([vx, vy, vz], axis=1) / v_mag
    
    # Altitude
    altitude = r_mag - R_earth
    
    # Atmospheric density at current altitude
    rho = atmospheric_density(altitude)
    
    # Gravitational acceleration
    g_x = -mu * rx / r_mag**3
    g_y = -mu * ry / r_mag**3
    g_z = -mu * rz / r_mag**3
    
    # Thrust (simplified model - constant thrust in velocity direction)
    # This can be modified based on mission profile
    thrust_magnitude = thrust / mass
    t_x = thrust_magnitude * vx / v_mag
    t_y = thrust_magnitude * vy / v_mag
    t_z = thrust_magnitude * vz / v_mag
    
    # Drag
    drag_magnitude = 0.5 * rho * v_mag**2 * drag_coefficient * cross_section_area / mass
    d_x = -drag_magnitude * vx / v_mag
    d_y = -drag_magnitude * vy / v_mag
    d_z = -drag_magnitude * vz / v_mag
    
    # PDE system
    drx_dt = vx
    dry_dt = vy
    drz_dt = vz
    dvx_dt = g_x + t_x + d_x
    dvy_dt = g_y + t_y + d_y
    dvz_dt = g_z + t_z + d_z
    
    return [
        drx_dt - y[:, 3:4],
        dry_dt - y[:, 4:5],
        drz_dt - y[:, 5:6],
        dvx_dt - (g_x + t_x + d_x),
        dvy_dt - (g_y + t_y + d_y),
        dvz_dt - (g_z + t_z + d_z),
    ]

# Initial conditions
def ic_func(x):
    # Initial position: 100km above Earth's surface in x-direction
    init_x = (R_earth + 100000)
    init_y = 0
    init_z = 0
    
    # Initial velocity: In the y-direction for orbital insertion
    # This velocity is chosen to begin an elliptical orbit
    init_vx = 0
    init_vy = np.sqrt(mu / init_x) * 0.9  # 0.9 factor to make it elliptical
    init_vz = 0
    
    return [init_x, init_y, init_z, init_vx, init_vy, init_vz]

# Domain: Time interval from 0 to 10000 seconds
geom = dde.geometry.TimeDomain(0, 10000)

# Initial condition
ic = dde.icbc.IC(geom, ic_func, lambda _, on_boundary: on_boundary)

# Create data (time domain problem with PDE and IC)
data = dde.data.PDE(
    geom,
    pde,
    [ic],
    num_domain=2000,
    num_boundary=100,
    solution=None,
    num_test=100,
)

# Neural network architecture
layer_size = [1] + [50] * 3 + [6]
activation = "tanh"
initializer = "Glorot uniform"
net = dde.nn.FNN(layer_size, activation, initializer)

# Create the deepxde Model
model = dde.Model(data, net)

# Train the model
model.compile("adam", lr=0.001)
losshistory, train_state = model.train(iterations=10000)

# Plot loss history
dde.utils.plot_loss_history(losshistory)
plt.savefig("loss_history.png")

# Generate predictions for visualization
t_pred = np.linspace(0, 10000, 1000)[:, None]
y_pred = model.predict(t_pred)

# Extract position vectors
x_pos = y_pred[:, 0]
y_pos = y_pred[:, 1]
z_pos = y_pred[:, 2]

# 3D Plot of the orbit
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Plot trajectory
ax.plot(x_pos, y_pos, z_pos, 'b-', label='Spacecraft Trajectory')

# Plot Earth (simplified as a sphere)
u, v = np.mgrid[0:2*np.pi:20j, 0:np.pi:10j]
x_earth = R_earth * np.cos(u) * np.sin(v)
y_earth = R_earth * np.sin(u) * np.sin(v)
z_earth = R_earth * np.cos(v)
ax.plot_surface(x_earth, y_earth, z_earth, color='g', alpha=0.2)

# Set labels and title
ax.set_xlabel('X (m)')
ax.set_ylabel('Y (m)')
ax.set_zlabel('Z (m)')
ax.set_title('Spacecraft Orbital Insertion Trajectory')

# Equal aspect ratio
max_range = np.max([np.max(x_pos) - np.min(x_pos),
                    np.max(y_pos) - np.min(y_pos),
                    np.max(z_pos) - np.min(z_pos)]) / 2.0
mid_x = (np.max(x_pos) + np.min(x_pos)) / 2.0
mid_y = (np.max(y_pos) + np.min(y_pos)) / 2.0
mid_z = (np.max(z_pos) + np.min(z_pos)) / 2.0
ax.set_xlim(mid_x - max_range, mid_x + max_range)
ax.set_ylim(mid_y - max_range, mid_y + max_range)
ax.set_zlim(mid_z - max_range, mid_z + max_range)

plt.legend()
plt.savefig("orbital_trajectory.png")
plt.show()

# Calculate orbital parameters
def calculate_orbital_elements(r, v):
    """Calculate orbital elements from position and velocity vectors."""
    r_mag = np.linalg.norm(r)
    v_mag = np.linalg.norm(v)
    
    # Specific angular momentum
    h = np.cross(r, v)
    h_mag = np.linalg.norm(h)
    
    # Node line
    n = np.cross([0, 0, 1], h)
    n_mag = np.linalg.norm(n)
    
    # Eccentricity vector
    e_vec = np.cross(v, h) / mu - r / r_mag
    e = np.linalg.norm(e_vec)
    
    # Semi-major axis
    a = h_mag**2 / (mu * (1 - e**2))
    
    # Inclination
    i = np.arccos(h[2] / h_mag)
    
    # Right ascension of ascending node
    omega = np.arccos(n[0] / n_mag)
    if n[1] < 0:
        omega = 2 * np.pi - omega
    
    # Argument of periapsis
    w = np.arccos(np.dot(n, e_vec) / (n_mag * e))
    if e_vec[2] < 0:
        w = 2 * np.pi - w
    
    # True anomaly
    v_true = np.arccos(np.dot(e_vec, r) / (e * r_mag))
    if np.dot(r, v) < 0:
        v_true = 2 * np.pi - v_true
    
    return {
        "semi_major_axis": a,
        "eccentricity": e,
        "inclination": np.degrees(i),
        "raan": np.degrees(omega),
        "arg_periapsis": np.degrees(w),
        "true_anomaly": np.degrees(v_true)
    }

# Print orbital elements at the end of simulation
final_pos = np.array([x_pos[-1], y_pos[-1], z_pos[-1]])
final_vel = np.array([y_pred[-1, 3], y_pred[-1, 4], y_pred[-1, 5]])

orbital_elements = calculate_orbital_elements(final_pos, final_vel)
print("\nFinal Orbital Elements:")
for key, value in orbital_elements.items():
    print(f"{key}: {value}")

# Plot altitude vs time
altitude = np.sqrt(x_pos**2 + y_pos**2 + z_pos**2) - R_earth
plt.figure(figsize=(10, 6))
plt.plot(t_pred, altitude / 1000)  # Convert to km
plt.xlabel('Time (s)')
plt.ylabel('Altitude (km)')
plt.title('Spacecraft Altitude vs Time')
plt.grid(True)
plt.savefig("altitude_profile.png")
plt.show()
