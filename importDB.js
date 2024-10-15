const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Coupon = require('./coupon.model');
const dotenv = require('dotenv');
dotenv.config();

//Conectat a Mongo DB
async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a la base de datos');
};
connectDB().catch(err => console.log(err));

//Lectura del excel
const filePath = path.resolve(__dirname, 'couponDB.xlsx');
const workbook = xlsx.readFile(filePath)

// Obtener la primera hoja del archivo Excel
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convierte los datos de la hoja en un array de objetos JSON
const rows = xlsx.utils.sheet_to_json(sheet);

// Función para guardar cada fila como un documento en MongoDB
const saveCoupons = async () => {
    try {
        for (let row of rows) {
            // Crea un nuevo documento usando el modelo Coupon
            const coupon = new Coupon({
                coupon_code: row.coupon_code,
                expiration_date: row.expiration_date,
                reward: row.reward
            });

            // Guarda el documento en MongoDB
            await coupon.save();
            console.log(`Coupon ${row.coupon_code} guardado correctamente.`);
        }
        console.log('Todos los cupones han sido guardados.');
    } catch (err) {
        console.error('Error al guardar los cupones:', err);
    } finally {
        // Cierra la conexión a la base de datos
        mongoose.connection.close();
    }
};

// Llama a la función para guardar los cupones
saveCoupons();
