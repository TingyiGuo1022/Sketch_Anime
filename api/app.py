from flask import Flask, request, send_file
from PIL import Image
import numpy as np
import json
import matplotlib.pyplot as plt
from flask_cors import CORS

def process_data(jsonString):
    image_points = json.loads(jsonString)
    sketch_points, color_points =[], []
    for line in image_points['lines']:
        if line['brushRadius'] == 2:
            sketch_points.append(line['points'])
        else:
            color_points.append((tuple(line['brushColor']['color']), line['points']))
    return sketch_points, color_points

def get_sketch_image(sketch_points):
    plt.axis('off')
    plt.gcf().set_size_inches(5.12, 5.12)
    plt.axis([0, 512, 0, 512])
    for current_line in sketch_points:
        current_line = np.array(list(map(lambda point: [point['x'], 512 - point['y']], current_line)))
        x, y = current_line[:,0], current_line[:,1]
        plt.plot(x, y, c='black', lw=3)
    plt.savefig("generated_images/sketch_image.jpg")
    plt.close()

def get_color_image(color_points):
    plt.axis('off')
    plt.axis([0, 512, 0, 512])
    plt.gcf().set_size_inches(5.12, 5.12)
    for one_color_points in color_points:
        points_position = np.array(list(map(lambda point: [point['x'], 512 - point['y']], one_color_points[1])))
        color = list(map(lambda one_rgb: one_rgb / 255, one_color_points[0]))
        x, y = points_position[:, 0], points_position[:, 1]
        plt.plot(x, y, c=color, lw=6)
    plt.savefig("generated_images/color_image.jpg")
    plt.close()

app = Flask(__name__)
CORS(app)

@app.route('/getImage/', methods=['POST', 'GET'])
def generate_anime():
    image_data = request.json
    sketch_points, color_points = process_data(image_data)
    get_sketch_image(sketch_points)
    get_color_image(color_points)
    sketch_data = np.asarray(Image.open('generated_images/sketch_image.jpg'))
    color_data = np.asarray(Image.open('generated_images/color_image.jpg'))
    return send_file('generated_images/sketch_image.jpg', mimetype='image/gif', as_attachment=True)


