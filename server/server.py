from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# app instance
app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:''@localhost/Equitel'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app
                 )
# api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hello world!",
        'people': ['Jack', 'Harry', 'Barry']
    })

# CRUD route for Products

# Products db model
class Productos(db.Model):
    __tablename__ = "Productos"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text)
    modelo = db.Column(db.String(100))
    cantidad_bodega = db.Column(db.Integer, nullable=False)
    valor_venta = db.Column(db.Numeric(10, 2), nullable=False)

    def __init__(self, nombre, descripcion, modelo, cantidad_bodega, valor_venta):
        self.nombre = nombre
        self.descripcion = descripcion
        self.modelo = modelo
        self.cantidad_bodega = cantidad_bodega
        self.valor_venta = valor_venta
class ProductoSchema(ma.Schema):
    class Meta:
        fields = ('id', 'nombre', 'descripcion', 'modelo',
                  'cantidad_bodega', 'valor_venta')

producto_schema = ProductoSchema()
productos_schema = ProductoSchema(many=True)

# List products
@app.route('/listar_productos', methods = ['GET'])
def listar_productos():
    productos = Productos.query.all()
    resultado_query = productos_schema.dump(productos)
    return jsonify(resultado_query)

# add a product
@app.route("/crear_producto", methods=['POST'])
def crear_producto():
    nombre = request.json['nombre']
    descripcion = request.json['descripcion']
    modelo = request.json['modelo']
    cantidad_bodega = request.json['cantidad_bodega']
    valor_venta = request.json['valor_venta']

    producto = Productos(nombre, descripcion, modelo, cantidad_bodega, valor_venta)
    db.session.add(producto)
    db.session.commit()

    return producto_schema.jsonify(producto)

if __name__ == "__main__":
    app.run(debug=True, port=9000)