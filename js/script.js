const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const filterAvailable = document.getElementById("filterAvailable");
const newProductButton = document.getElementById("newProduct");
const formSection = document.getElementById("formSection");
const listSection = document.getElementById("listSection");
const filterControls = document.querySelector(".filter-controls");
const filter = document.querySelector("filter");

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  const products = getProducts();
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterAvailable.value;

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchValue))
    .filter(p => filterValue === "Todos" || p.available === filterValue);

  productList.innerHTML = "";

  filteredProducts.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })}</td>
      <td>
        <button class="action-button edit" onclick="editProduct(${index})">Editar</button>
        <button class="action-button" onclick="deleteProduct(${index})">Excluir</button>
      </td>
    `;
    productList.appendChild(row);
  });
}

function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const value = parseFloat(document.getElementById("value").value);
  const available = document.getElementById("available").value;

  if (!name || !description || value <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const products = getProducts();
  products.push({ name, description, value, available });
  saveProducts(products);
  renderProducts();
  productForm.reset();
  toggleSections("list");
}

function deleteProduct(index) {
  const products = getProducts();
  products.splice(index, 1);
  saveProducts(products);
  renderProducts();
}

function editProduct(index) {
  const products = getProducts();
  const product = products[index];

  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("value").value = product.value;
  document.getElementById("available").value = product.available;

  products.splice(index, 1);
  saveProducts(products);
  renderProducts();
  toggleSections("form");
}

const filterSection = document.getElementById("filterSection");

function toggleSections(section) {
  if (section === "form") {
    formSection.style.display = "block";
    listSection.style.display = "none";
    filterSection.classList.add("hidden"); // Esconde os filtros na tela de cadastro
  } else {
    formSection.style.display = "none";
    listSection.style.display = "block";
    filterSection.classList.remove("hidden"); // Exibe os filtros na tela de listagem
  }
}


searchInput.addEventListener("input", renderProducts);
filterAvailable.addEventListener("change", renderProducts);
productForm.addEventListener("submit", addProduct);
newProductButton.addEventListener("click", () => toggleSections("form"));
renderProducts();
toggleSections("list");
