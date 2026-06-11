const header = document.getElementById("header-group");
const nav = document.querySelector('.nav-group');
const navProfile = document.getElementById("profile");
const navProduct = document.getElementById("product");
const navContact = document.getElementById("contact");
const typeArea = document.getElementById("mengetik");
const digitalArea = document.querySelector(".list-product-digital");
const barangArea = document.querySelector(".list-product-barang");
const jasaArea = document.querySelector(".list-product-jasa");
const contactArea = document.getElementById("contact-group");

const word = ["Layanan Digital", "Pulsa & Paket Data", "Transfer Tunai", "Token Listrik", "Skin Care", "Jasa Desain", "Building Website"];
let indexWord = 0;
let indexLatter = 0;
let menghapus = false;

navProfile.addEventListener("click", function(){
  window.location.href = "#profile-group";
})
navProduct.addEventListener("click", function(){
  window.location.href = "#product-group";
})
navContact.addEventListener("click", function(){
  window.location.href = "#contact-group";
})

window.addEventListener("scroll", function(){
  let posisiScroll = window.scrollY;
  if(posisiScroll > 80 && !header.classList.contains("off")){
    header.classList.add("off");
    header.style.left = '10%';
    header.removeEventListener("click", headerOpen);
    header.addEventListener("click", headerOpen)
    setTimeout(function(){
      let lebar = header.getBoundingClientRect().width;
      if(lebar <= 62){
      nav.style.display = "none"
      header.style.justifyContent = 'center';
      header.style.left = '85%';
      }
    }, 1000)
  }else if(posisiScroll < 80 && header.classList.contains("off")){
    headerOpen();
  }
  cardShow();
})

function cardShow(){
  let card = document.querySelectorAll(".card");
  card.forEach(function(c){
    let position = c.getBoundingClientRect().top;
    if(position >= window.innerHeight){
      c.classList.add("show")
      c.classList.remove("show");
    }else{
      c.classList.remove("show")
      c.classList.add("show");
    }
  })
}

function headerOpen(){
  header.removeEventListener("click", headerOpen);
  header.classList.remove("off");
  header.style.left = '10%';
  header.style.justifyContent = 'space-between';
  nav.style.display = "flex";
}

function orientasi(){
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  if(height > width){
    console.log("potret")
    navProfile.innerHTML = `<img src="img/personal.svg" style= "height: 65%;">`;
    navProfile.classList.remove("landscape");
    navProduct.innerHTML = `<img src="img/shoping.svg" style= "height: 65%;">`;
    navProduct.classList.remove("landscape");
    navContact.innerHTML = `<img src="img/link.svg" style= "height: 65%;">`;
    navContact.classList.remove("landscape");
  }else {
    console.log("landscape")
    navProfile.innerHTML = "Profile";
    navProfile.classList.add("landscape");
    navProduct.innerHTML = "Product";
    navProduct.classList.add("landscape");
    navContact.innerHTML = "Contact";
    navContact.classList.add("landscape");
  }
}
window.addEventListener("resize", function(){
  orientasi();
  cardShow();
});
window.addEventListener("load", orientasi);

function typing(){
  let theWord = word[indexWord];
  if(!menghapus){
    typeArea.textContent = theWord.substring(0, indexLatter++);
  }else{
    typeArea.textContent = theWord.substring(0, indexLatter--)
  }
  if(!menghapus && indexLatter > theWord.length){
    menghapus = true;
    setTimeout(typing, 700);
  }else if(menghapus && indexLatter == 0){
    indexWord = (indexWord + 1) % word.length;
    menghapus = false;
    setTimeout(typing, 350)
  }else{
    if(!menghapus){
      setTimeout(typing, 150);
    }else{
      setTimeout(typing, 75)
    }
  }
}

function viewProduct(){
  let produkDigital = [];
  let produkBarang = [];
  let produkJasa = [];
  fetch('../assets/product.json')
  .then(function(res){
    return res.json();
  })
  .then(function(dataProduct){
    dataProduct.forEach(function(produk){
      const card = document.createElement("div");
      card.classList.add("card");
      const judul = document.createElement("h3");
      judul.textContent = produk.nama;
      const deskripsi = document.createElement("h4");
      deskripsi.textContent = produk.deskripsi;
      const harga = document.createElement("h5");
      harga.textContent = `Rp ${produk.harga.toLocaleString("id-ID")}`;
      const gambar = document.createElement("img");
      gambar.classList.add("gambar-product");
      gambar.src = "../img/" + produk.gambar;
      const tombol = document.createElement("div");
      tombol.classList.add("btn");
      const btnPesan = document.createElement("button");
      const btnInfo = document.createElement("button");
      btnPesan.classList.add("btn-pesan");
      btnPesan.textContent = "Pesan";
      btnPesan.addEventListener("click", function(){
        window.open(produk.link);
      })
      btnInfo.classList.add("btn-info");
      btnInfo.textContent = "!";
      btnInfo.addEventListener("click", function(){
        alert(produk.info);
      })
      tombol.append(btnPesan, btnInfo);
      card.append(gambar, judul, deskripsi, harga, tombol);
      for(let key in produk){
        if(key === "kategori" && produk[key] == "produk digital"){
          produkDigital.push(produk);
          digitalArea.append(card);
        }else if(key === "kategori" && produk[key] == "produk barang"){
          produkBarang.push(produk);
          barangArea.append(card);
        }else if(key === "kategori" && produk[key] == "produk jasa"){
          produkJasa.push(produk);
          jasaArea.append(card);
        }
      }
    })
    console.log(produkDigital);
    console.log(produkBarang);
    console.log(produkJasa);
    cardShow();
  })
  .catch(function(er){
    console.log(er)
  })
}

function viewContact(){
  fetch('../assets/contact.json')
  .then(function(res){
    return res.json();
  })
  .then(function(dataContact){
    dataContact.forEach(function(contact){
      const logo = document.createElement("img");
      logo.src = "../img/" + contact.gambar;
      logo.classList.add("logo-contact");
      const textContainer = document.createElement("div");
      textContainer.classList.add("container");
      const text = document.createElement("h2");
      text.textContent = contact.id;
      const userName = document.createElement("h3");
      userName.textContent = contact.userName;
      const card = document.createElement("div");
      card.classList.add("card-contact");
      textContainer.append(text, userName);
      card.append(logo, textContainer)
      contactArea.append(card);
      card.addEventListener("click", function(){
        window.open(contact.link);
      })
    })
  })
  .catch(function(er){
    console.log(er)
  })
}

viewContact();
viewProduct();
typing();