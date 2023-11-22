const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const upload = require('./public/js/imgControl/control');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



const dbURI = 'mongodb+srv://randyluna93:FZasa1ielX2Iknw9@cluster0.ajkai7b.mongodb.net/test';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {

    
    console.log('Conexión exitosa a MongoDB Atlas');
    console.log('Base de datos:', result.connections[0].name);
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
  });

const pokemonSchema = new mongoose.Schema({
  nombre: { type: String },
  tipo: { type: String },
  pokeInfo: { type: String },
  tieneEvolucion: { type: Boolean },
  debilidades: { type: [String] },
  imagePath:{ type: String }
});



app.post('/pokemons', upload.single('uploaded_file'), async (req, res) => {
  const newPokemonData = req.body;
  const image = req.file;
   if (image) {
     newPokemonData.imagePath = image.filename; 
   } else {
     newPokemonData.imagePath = "test";
   }
     try {
        const newPokemon = await Pokemon.create(newPokemonData);
        res.status(201).json(newPokemon);
      } catch (err) {
        console.error('Error al agregar el Pokémon:', err);
        res.status(500).json({ message: 'Error al agregar el pokémon', error: err.message });
      }
});



const Pokemon = mongoose.model('Pokemon', pokemonSchema, 'pokemons'); 
app.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los pokémons', error: err });
  }
});

app.put('/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  const updatedPokemonData = req.body;

  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(id, updatedPokemonData, { new: true });
    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }
    res.json(updatedPokemon);
  } catch (err) {
    console.error('Error al actualizar el Pokémon:', err);
    res.status(500).json({ message: 'Error al actualizar el pokémon', error: err.message });
  }
});

app.delete('/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPokemon = await Pokemon.findByIdAndDelete(id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon eliminado' });
  } catch (err) {
    console.error('Error al eliminar el Pokémon:', err);
    res.status(500).json({ message: 'Error al eliminar el pokémon', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
