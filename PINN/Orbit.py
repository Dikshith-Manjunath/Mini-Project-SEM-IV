import deepxde as dde
from deepxde.backend import tf
import numpy as np
import matplotlib.pyplot as plt

def pde(x,y): 
    dy_xx = dde.grad.hessian(y, x)
    return dy_xx + np.pi**2 * tf.sin(np.pi * x)

geom = dde.geometry.Interval(-1,1)
