async function ucitajHotele() {
    const response = await fetch('https://joris.testmaster.fon.bg.ac.rs/api/hoteli')
    const hoteli = await response.json();
    const hoteliSelect = document.getElementById('hoteli');
    hoteli.forEach(hotel => {
        hoteliSelect.options.add(new Option(hotel.naziv, hotel.id));
    });
}   
ucitajHotele();

async function ucitajSobe() {
    const hoteliSelect =  document.getElementById('hoteli');
    
    const response = await fetch(`https://joris.testmaster.fon.bg.ac.rs/api/hoteli/${hoteliSelect.value}`);
    const detaljiHotela = await response.json();
    console.log(detaljiHotela);
    const sobeSelect = document.getElementById('sobe');
    sobeSelect.innerHTML = '';
    detaljiHotela.sobe.forEach(soba => {
        sobeSelect.options.add(new Option(soba.naziv, soba.id));
    })
}

async function cekajHotel() {
    const hoteliSelect = document.getElementById('hoteli');
    hoteliSelect.addEventListener("change", ucitajSobe);
}
cekajHotel();

async function rezervisi(e){
    e.preventDefault();
    const tabela = document.getElementById('tabela')
    const poruka = document.getElementById('poruka')
    const hotelid = document.getElementById('hoteli').value;
    const sobaid = document.getElementById('sobe').value;
    const datumod = document.getElementById('datumod').value;
    const datumdo = document.getElementById('datumdo').value;
    const dorucakcb = document.getElementById('dorucak').checked;
    const rucakcb = document.getElementById('rucak').checked;
    const veceracb = document.getElementById('vecera').checked;
    const napomenaval = document.getElementById('napomena').value;
    if (hotelid != (null || '') && sobaid != (null || '') && datumod != null && datumdo != null) {
        if (Date.parse(datumod) < Date.parse(datumdo)) {
            poruka.innerHTML = ""
            const rezervacija= {
                hotelID: hotelid,
                sobaID: sobaid,
                datumOd: datumod,
                datumDo: datumdo,
                dorucak: dorucakcb,
                rucak: rucakcb,
                vecera: veceracb,
                napomena: napomenaval
            }
            const rezervacijaJSON = JSON.stringify(rezervacija)
            console.log(rezervacijaJSON)

            var xhr = new XMLHttpRequest();
        var url = "https://joris.testmaster.fon.bg.ac.rs/api/hoteli/rezervisi";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = async function () {
             if (xhr.readyState === 4 && xhr.status === 200) {
                 console.log("Response received successfully.");
                 const response = await fetch(`https://joris.testmaster.fon.bg.ac.rs/api/hoteli/${hotelid}`);
                 const detaljiHotela = await response.json();
                 
                 let red = tabela.insertRow(1)
                 let polje1 = red.insertCell()
                 let polje2 = red.insertCell()
                 let polje3 = red.insertCell()
                 let polje4 = red.insertCell()
                 polje1.innerHTML = detaljiHotela.naziv
                 detaljiHotela.sobe.forEach(soba => {
                    if (soba.id == sobaid) {
                        polje2.innerHTML = soba.naziv
                    }
                 });
                 polje3.innerHTML = datumod
                 polje4.innerHTML = datumdo
                 }
         };
        xhr.send(rezervacijaJSON);
            
        
        } else{
            poruka.innerHTML = "* Datumi nisu validni"
            console.log('Datumi nisu validni');
        }
    } else {
            poruka.innerHTML = "* Obavezna polja nisu popunjena"
        console.log('Obavezna polja nisu popunjena');
    }

}

const dugme = document.getElementById('btn-rezervisi');
dugme.addEventListener("click", rezervisi);



