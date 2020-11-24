from flask import Flask, request, send_file
from PIL import Image
import numpy as np
import json
import matplotlib.pyplot as plt
from flask_cors import CORS
import torch as nn
from torchvision import transforms
import time

def process_data(jsonString):
    image_points = json.loads(jsonString)
    sketch_points, color_points =[], []
    for line in image_points['lines']:
        if line['brushRadius'] == 2:
            sketch_points.append(line['points'])
        else:
            color_points.append((tuple(line['brushColor']['color']), line['points']))
    return sketch_points, color_points

def get_images(data_points, point_type):
    plt.gcf().set_size_inches(5.12, 5.12)
    plt.axis([0, 511, 0, 511])
    plt.axis('off')
    for current_points in data_points:
        if point_type == 'color':
            points_position = np.array(list(map(lambda point: [point['x'], 512 - point['y']], current_points[1])))
            color = list(map(lambda one_rgb: one_rgb / 255, current_points[0]))
            x, y = points_position[:, 0], points_position[:, 1]
            plt.plot(x, y, c=color, lw=6)
        else:
            current_line = np.array(list(map(lambda point: [point['x'], 512 - point['y']], current_points)))
            x, y = current_line[:,0], current_line[:,1]
            plt.plot(x, y, c='black', lw=3)
    plt.savefig("generated_images/"+ point_type +"_image.jpg")
    plt.close()

def process_color_data_array(color_image, transform):
    color_array = transform['rgb'](color_image.resize((128,128)))
    converted_color_array = np.asarray(color_image.resize((128, 128)).convert("L"))
    binary_mask = nn.Tensor((converted_color_array < 250).reshape((1, 128, 128)))
    color_result = nn.cat([color_array, binary_mask])
    return nn.reshape(color_result, (1, 4, 128, 128))

def generate_result_anime(sketch_data, color_data):
    """ In this function, call the model stored in models directory to generate  anime character"""
    ######TO DO###########
    pass
    ######################



app = Flask(__name__)
CORS(app)

@app.route('/getImage/', methods=['POST', 'GET'])
def generate_anime():
    transform = {'sketch': transforms.Compose([transforms.ToTensor(),
                                           transforms.Normalize((0.5), (0.5))]),
                 'rgb': transforms.Compose([transforms.ToTensor(),
                                        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
                }
    image_data = request.json
    sketch_points, color_points = process_data(image_data)
    get_images(sketch_points, 'sketch')
    get_images(color_points, 'color')
    sketch_data = transform['sketch'](Image.open('generated_images/sketch_image.jpg').convert("L"))
    color_hint = process_color_data_array(Image.open('generated_images/color_image.jpg'), transform)
    # return {"sketch_data": sketch_data.shape, "color_hint": color_hint.shape}
    time.sleep(2)
    return send_file('generated_images/result_2.jpg', mimetype='image/gif', as_attachment=True)



