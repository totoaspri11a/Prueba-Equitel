from flask import Flask, jsonify, request, session, g
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from sqlalchemy import Column, Integer, DateTime, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from Models.Usuario import db, Usuario

# app instance
app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:''@localhost/Equitel'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'prueba-Equitel'

app.config['SESSION_COOKIE_NAME'] = 'mi_sesion'
app.config['SESSION_COOKIE_SECURE'] = True  # Asegura que las cookies de sesión solo se envíen a través de HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Asegura que las cookies de sesión no sean accesibles a través de JavaScript


ma = Marshmallow(app)
bcrypt = Bcrypt(app)
db.init_app(app)

session_rol = None
with app.app_context():
    db.create_all()

# signup route
@app.route("/signup", methods=['POST'])
def signup():
    nombre = request.json['nombre']
    email = request.json['email']
    password = request.json['password']
    rol = request.json['rol']

    usuario_existe = Usuario.query.filter_by(email=email).first() is not None

    print("Usuario: ", Usuario.query.filter_by(email=email).first)
    if usuario_existe:
        return jsonify({"error": "email ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_usuario = Usuario(nombre=nombre, email=email, password=hashed_password, rol=rol)
    db.session.add(new_usuario)
    db.session.commit()

    session["id"] = new_usuario.id

    return jsonify({
        "nombre": new_usuario.nombre,
        "email": new_usuario.email,
        "rol": new_usuario.rol
})

# login route
@app.route("/login", methods=["POST"])
def login_usuario():
    email = request.json["email"]
    password = request.json["password"]

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario is None:
        return jsonify({"error": "Usuario no encontrado"}), 401
    
    if not bcrypt.check_password_hash(usuario.password, password):
        return jsonify({"error": "Contraseña incorrecta"}), 401
    
    session["id_usuario"] = usuario.id
    session["rol"] = usuario.rol
    tmp = session["rol"]
    session_rol = session["rol"]
    print("tmp:", tmp)

    return jsonify({
        "id": usuario.id,
        "email": usuario.email,
        "rol": usuario.rol
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

# Details / edit product
@app.route('/detalles_producto/<id>', methods=['GET'])
def detalles_producto(id):
    producto = Productos.query.get(id)
    return producto_schema.jsonify(producto)

@app.route('/editar_producto/<id>', methods=['PUT'])
def editar_producto(id):
    producto = Productos.query.get(id)

    producto.nombre = request.json['nombre']
    producto.descripcion = request.json['descripcion']
    producto.modelo = request.json['modelo']
    producto.cantidad_bodega = request.json['cantidad_bodega']
    producto.valor_venta = request.json['valor_venta']

    db.session.commit()
    return producto_schema.jsonify(producto)

# Delete a product
@app.route('/borrar_producto/<id>', methods=['DELETE'])
def borrar_producto(id):
    producto = Productos.query.get(id)
    db.session.delete(producto)
    db.session.commit()
    return producto_schema.jsonify(producto)

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


# Rutas para CRUD Usuario
class UsuarioSchema(ma.Schema):
    class Meta:
        fields = ('id', 'nombre', 'email', 'password', 'rol')

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

# Listar usuarios
@app.route('/listar_usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    resultado_query = usuarios_schema.dump(usuarios)
    return jsonify(resultado_query)

# Detalles / editar usuario
@app.route('/detalles_usuario/<id>', methods=['GET'])
def detalles_usuario(id):
    usuario = Usuario.query.get(id)
    return usuario_schema.jsonify(usuario)

@app.route('/editar_usuario/<id>', methods=['PUT'])
def editar_usuario(id):
    usuario = Usuario.query.get(id)

    nuevo_email = request.json['email']

    # Verificar si el nuevo email ya está en uso por otro usuario
    if Usuario.query.filter_by(email=nuevo_email).first() and nuevo_email == usuario.email:
        print("Es igual el email")
        return jsonify({'error': 'El email ya está en uso'}), 400

    usuario.nombre = request.json['nombre']
    usuario.email = nuevo_email
    usuario.rol = request.json['rol']

    db.session.commit()
    return usuario_schema.jsonify(usuario)

# Borrar un usuario
@app.route('/borrar_usuario/<id>', methods=['DELETE'])
def borrar_usuario(id):
    usuario = Usuario.query.get(id)
    if usuario:
        db.session.delete(usuario)
        db.session.commit()
        return usuario_schema.jsonify(usuario)
    else:
        return jsonify({"message": "El usuario con el ID especificado no existe"}), 404

# Agregar un usuario
@app.route("/crear_usuario", methods=['POST'])
def crear_usuario():
    nombre = request.json['nombre']
    email = request.json['email']
    password = request.json['password']
    rol = request.json['rol']

    # Verificar si el email ya está en uso por otro usuario
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está en uso'}), 400
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_usuario = Usuario(nombre=nombre, email=email, password=hashed_password, rol=rol)
    db.session.add(new_usuario)
    db.session.commit()

    return usuario_schema.jsonify(new_usuario)

# Modelo Ventas

class Ventas(db.Model):
    __tablename__ = "Ventas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuarios.id'), nullable=False)
    fecha = Column(DateTime, nullable=False, server_default='CURRENT_TIMESTAMP')
    total_venta = Column(DECIMAL(10, 2), nullable=False)

    # Define la relación con el modelo Usuario
    usuario = relationship("Usuario") 

    # Definir la relación con el modelo Detalle_Ventas
    detalles_venta = relationship("Detalle_Ventas", back_populates="venta")

    def serialize(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'fecha': self.fecha.strftime('%Y-%m-%d %H:%M:%S'),  # Formatear la fecha como string
            'total_venta': float(self.total_venta)  # Convertir a float para serializar
        }

    def __repr__(self):
        return f"Venta(id={self.id}, id_usuario={self.id_usuario}, fecha={self.fecha}, total_venta={self.total_venta})"

# Definir el esquema de Ventas
class VentasSchema(ma.Schema):
    class Meta:
        fields = ('id', 'id_usuario', 'fecha', 'total_venta')

venta_schema = VentasSchema()
ventas_schema = VentasSchema(many=True)

#Clase detalle ventas
class Detalle_Ventas(db.Model):
    __tablename__ = "Detalle_Ventas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_venta = Column(Integer, ForeignKey('Ventas.id'), nullable=False)
    id_producto = Column(Integer, ForeignKey('Productos.id'), nullable=False)
    cantidad_vendida = Column(Integer, nullable=False)
    precio_unitario = Column(DECIMAL(10, 2), nullable=False)

    # Definir la relación con la tabla Ventas
    venta = relationship("Ventas", back_populates="detalles_venta")

    def __repr__(self):
        return f"Detalle_Ventas(id={self.id}, id_venta={self.id_venta}, id_producto={self.id_producto}, cantidad_vendida={self.cantidad_vendida}, precio_unitario={self.precio_unitario})"

# Rutas para ventas
# Agregar venta
@app.route("/crear_venta", methods=['POST'])
def crear_venta():
    id_usuario = request.json['id_usuario']
    productos_vendidos = request.json['productos_vendidos']

    # Verificar si el usuario existe
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return jsonify({'error': 'El usuario especificado no existe'}), 404

    total_venta = 0  # Inicializar el total de la venta

    # Verificar si hay suficientes productos en el inventario y calcular el total de la venta
    for producto_id, cantidad_vendida in productos_vendidos.items():
        producto = Productos.query.get(producto_id)
        if not producto:
            return jsonify({'error': f'El producto con ID {producto_id} no existe'}), 404
        if producto.cantidad_bodega < cantidad_vendida:
            return jsonify({'error': f'Cantidad insuficiente del producto {producto.nombre} en el inventario'}), 400
        
        # Calcular el subtotal de este producto y sumarlo al total de la venta
        subtotal_producto = producto.valor_venta * cantidad_vendida
        total_venta += subtotal_producto

    # Crear la venta
    nueva_venta = Ventas(id_usuario=id_usuario, total_venta=total_venta)
    db.session.add(nueva_venta)
    db.session.commit()

    # Actualizar el inventario y guardar los detalles de la venta
    for producto_id, cantidad_vendida in productos_vendidos.items():
        producto = Productos.query.get(producto_id)
        producto.cantidad_bodega -= cantidad_vendida

        # Crear y guardar el detalle de la venta
        detalle_venta = Detalle_Ventas(id_venta=nueva_venta.id, id_producto=producto_id, cantidad_vendida=cantidad_vendida, precio_unitario=producto.valor_venta)
        db.session.add(detalle_venta)

    db.session.commit()

    return jsonify({'message': 'Venta realizada correctamente'})

# Listar ventas
@app.route('/listar_ventas', methods=['GET'])
def listar_ventas():
    id_usuario = request.json['id']
    rol = request.json['rol']

    if id_usuario is None or rol is None:
        return jsonify({'error': 'Se requiere el ID de usuario y el rol'}), 400

    # Verificar si el usuario es administrador o vendedor
    if rol == 'admin':
        ventas = Ventas.query.all()
    elif rol == 'vendedor':
        ventas = Ventas.query.filter_by(id_usuario=id_usuario).all()
    else:
        return jsonify({'error': 'Rol no válido'}), 400
    resultado_query = ventas_schema.dump(ventas)
    return jsonify(resultado_query)

# Detalles de venta
@app.route('/detalles_venta/<id>', methods=['GET'])
def detalles_venta(id):
    venta = Ventas.query.get(id)
    if not venta:
        return jsonify({'error': 'La venta especificada no existe'}), 404
    return jsonify(venta.serialize())


if __name__ == "__main__":
    app.run(debug=True, port=9000)