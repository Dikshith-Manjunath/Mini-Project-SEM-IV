import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Define the model
model = keras.Sequential([
    layers.Dense(50, activation='tanh', input_shape=(input_dim,)),  # First hidden layer
    layers.Dense(50, activation='tanh'),  # Second hidden layer
    layers.Dense(50, activation='tanh'),  # Third hidden layer
    layers.Dense(output_dim, activation='softmax')  # Output layer (adjust activation as needed)
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Print model summary
model.summary()
