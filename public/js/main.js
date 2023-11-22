async function getPokemons() {
  const response = await fetch('/pokemons');
  const pokemons = await response.json();
  return pokemons;
}

const pokemonList = document.getElementById('pokemonList');

function changeTab(tabIndex) {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  tabs[tabIndex - 1].classList.add('active');
  tabContents[tabIndex - 1].classList.add('active');
}

const showAllPokemons = document.getElementById("pokeListbt");
const fetchPokemonList = async () => {
  pokemonList.innerHTML = "";
  try {
    const pokemons = await getPokemons();
    pokemons.forEach(pokemon => {
      let evolucion = pokemon.tieneEvolucion ? "si" : "no";
      pokemonList.innerHTML +=
        `
          <li class="pokerCard" id="${pokemon._id}">
          <p> Nombre : ${pokemon.nombre}</p>
          <img src="${pokemon.imagePath}" alt="">
          <p> Tipo : ${pokemon.tipo}</p>
          <p> pokeInfo : ${pokemon.pokeInfo}</p>
          <p> Posee Evolucion : ${evolucion}</p>
          <p> Debilidades : ${pokemon.debilidades.join(', ')}</p>
          <button class="deleteButton btn-style" data-id="${pokemon._id}">Eliminar</button>
          <button class="updateButton btn-style" data-pokemon='${JSON.stringify(pokemon)}'>Editar</button>
          </li>
          `;
    });
  } catch (err) {
    console.error('Error al obtener la lista de pokémones:', err);
  }
};
showAllPokemons.addEventListener('click', fetchPokemonList);



const formEvent = document.getElementById('pokemonForm');
formEvent.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(formEvent);
  const formDataObject = {
    nombre: formData.get('nombre'),
    tipo: formData.get('tipo'),
    pokeInfo: formData.get('pokeInfo'),
    tieneEvolucion: (formData.get('tieneEvolucion') ? true : false),
    debilidades: formData.get('debilidades').split(','),
  };
  console.log(formDataObject)

  const imageFile = formData.get('image');
  formDataObject.image = imageFile;

  try {
    const response = await fetch('/pokemons', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newPokemon = await response.json();
      console.log('Nuevo Pokémon creado:', newPokemon);

    } else {
      console.error('Error al crear el Pokémon:', response.statusText);
    }
  } catch (err) {
    console.error('Error al crear el Pokémon:', err);
  }
});


async function deletePokemon(pokemonId) {
  try {
    const response = await fetch(`/pokemons/${pokemonId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Pokémon eliminado');

      const pokemonElement = document.getElementById(pokemonId);
      console.log(pokemonElement)
      if (pokemonElement) {
        pokemonElement.remove();
      }
    } else {
      console.error('Error al eliminar el Pokémon:', response.statusText);
    }
  } catch (err) {
    console.error('Error al eliminar el Pokémon:', err);
  }
}


pokemonList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('deleteButton')) {
    const pokemonId = event.target.getAttribute('data-id');
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este Pokémon?');
    if (confirmation) {
      await deletePokemon(pokemonId);
    }
  }
});

const editUpdate = document.getElementById("editUpdate");
const editForm = document.getElementById("editForm");
const closeeditUpdate = document.querySelector(".close");
let currentPokemon = null;

pokemonList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('updateButton')) {
    const pokemonDetails = JSON.parse(event.target.getAttribute('data-pokemon'));
    currentPokemon = pokemonDetails;
    document.getElementById('editName').value = currentPokemon.nombre;
    document.getElementById('editType').value = currentPokemon.tipo;
    document.getElementById('editDescription').value = currentPokemon.pokeInfo;
    document.getElementById('editHasEvolution').checked = currentPokemon.tieneEvolucion;
    document.getElementById('editWeaknesses').value = currentPokemon.debilidades.join(', ');

    editUpdate.style.display = "block";
  }
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (currentPokemon) {
    const editedPokemon = {
      nombre: document.getElementById('editName').value,
      tipo: document.getElementById('editType').value,
      pokeInfo: document.getElementById('editDescription').value,
      tieneEvolucion: document.getElementById('editHasEvolution').checked,
      debilidades: document.getElementById('editWeaknesses').value.split(','),
    };
    try {
      const response = await fetch(`/pokemons/${currentPokemon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPokemon),
      });

      if (response.ok) {
        console.log('Pokémon actualizado');
        fetchPokemonList();
        editUpdate.style.display = "none";
      } else {
        console.error('Error al actualizar el Pokémon:', response.statusText);
      }
    } catch (err) {
      console.error('Error al actualizar el Pokémon:', err);
    }
  }
});

closeeditUpdate.addEventListener('click', () => {
  editUpdate.style.display = "none";
});