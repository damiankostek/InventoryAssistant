const htmlToPdf = require('html-pdf');

const admin = require("./admin");
const db = require("./database.js");

async function createRaportWH(nameWH,res) {
    const filter = { name: nameWH };

    try {
        const get_table = await db.Global.findOne(filter);
        const table_data = `${String(get_table.updated_at.getDate()).padStart(2, '0')}.${String(get_table.updated_at.getMonth() + 1).padStart(2, '0')}.${get_table.updated_at.getFullYear()}`;

        const get_products = await admin.getAllProducts(nameWH);

        let html = `<style>
        body{
            margin:0;
            padding:0;
        }
        #page{
            width: 800px;
            font-size:8px;
        }
        #dane1 > div:nth-child(1){
            float: left;
            width: 365px;
            margin-top: 35px;
            margin-left: 35px;
            height: 10px;
        }
        #dane1 > div:nth-child(2){
            text-align: right;
            float: left;
            width: 345px;
            margin-top: 35px;
            margin-right: 55px;
            height: 10px;
        }
        #dane2 > div{
            float: left;
            width: 350px;
            margin-top: 35px;
            margin-left: 35px;
            margin-right: 35px;
            height: 30px;
        }
        #breakStyle {
            height: 80px;
        }
        .tab{
            margin:2px;
        }
        .tab span:first-child{
            display: inline-block;
            width: 220px;
            background-color: lightgray;
            border-top: 1px solid gray;
            text-align: center;
        }
        #dane1 .tab span:last-child{
            display: inline-block;
            width: 220px;
            font-weight: bold;
            text-align: center;
        }
        table{
            font-size:8px;
            border-top: 1px solid gray;
            margin-top: 50px;
            margin-left: 47px;
            width: 695px;
        }
        table th{
            background-color: lightgray;
        }
        table th, table td{
            border-right: 1px solid gray;
        }
        table th:first-child, table td:first-child{
            border-left: 1px solid gray;
        }
        table tr:nth-child(even){
            background-color: rgb(255, 255, 255);
        }
        table tr:nth-child(odd){
            background-color: rgb(235, 235, 235);
        }
        </style>`
            html += `
            <div id="page">
            <div id="dane1">
                <div>
                    <img src="https://drive.google.com/uc?export=view&id=1g26yBfc-DxOFQsyoCWFuWyuStZJk5eb-" alt="QR" style="float: left; height: auto; width: 8em;"></img>
                    <span style="float: left; text-align: left; font-size: 2.5em; margin-left: 0.5em; margin-top: 0.4em;">
                        <span>Inventory</span><br />
                        <span margin-top: 0.2em;>Assistant</span><br />
                    </span>
                </div>
                <div>
                    <div class="tab">
                        <span>Raport z inwentaryzacji</span>
                    </div>
                    <div class="tab">
                        <span>Magazyn</span>
                        <span>${get_table.name}</span>
                    </div>
                    <div class="tab">
                        <span>Data</span>
                        <span>${table_data}</span>
                    </div>
                </div>
            </div>
            <div id='breakStyle'>
            </div>
            <div id="dane2">
                <table cellspacing="0">
                    <tr>
                        <th style="width:15px">Lp.</th>
                        <th >Kod QR</th>
                        <th >Nazwa</th>
                        <th >Ilość</th>
                        <th >Ilość Inw.</th>
                        <th >Pracownik</th>
                        <th >Data i godzina</th>
                    </tr>`;
                    get_products.forEach((element, index) => {
                        const product_data = `${String(element.updated_at.getDate()).padStart(2, '0')}.${String(element.updated_at.getMonth() + 1).padStart(2, '0')}.${element.updated_at.getFullYear()} ${String(element.updated_at.getHours()).padStart(2, '0')}:${String(element.updated_at.getMinutes()).padStart(2, '0')}`;
                        html += `<tr>
                            <td style="text-align: center;">`+(index+1)+`</td>
                            <td style="text-align: center;">${element.qrCode}</td>
                            <td style="text-align: center;">${element.name}</td>
                            <td style="text-align: center;">${element.quantity}</td>
                            <td style="text-align: center;">${element.newQuantity}</td>
                            <td style="text-align: center;">${element.employee}</td>
                            <td style="text-align: center;">${product_data}</td>
                            </tr>`
                    })
            html+= `    
            </table>
            </div>
            </div>`;
            pdfBuffer(html)
                .then((pdfBuffer) => {
                    res.setHeader('Content-Disposition', 'attachment; filename=Raport'+nameWH+'.pdf');
                    res.setHeader('Content-Type', 'application/pdf');
            
                    res.send(pdfBuffer);
                    console.log('Udane wygenerowanie PDF.');
                })
                .catch((error) => {
                    console.error('Błąd generowania PDF:', error);
                });
    } catch (error) {
      console.error(`Error removing table: ${error}`);
      throw error;
    }
  }

  async function createRaportIN(nameIN,res) {
    const filter = { name: nameIN };

    try {
        const get_table = await db.Global.findOne(filter);
        const table_data = `${String(get_table.updated_at.getDate()).padStart(2, '0')}.${String(get_table.updated_at.getMonth() + 1).padStart(2, '0')}.${get_table.updated_at.getFullYear()}`;

        const get_positions = await admin.getAllPositions(nameIN);

        let html = `<style>
        body{
            margin:0;
            padding:0;
        }
        #page{
            width: 800px;
            font-size:8px;
        }
        #dane1 > div:nth-child(1){
            float: left;
            width: 365px;
            margin-top: 35px;
            margin-left: 35px;
            height: 10px;
        }
        #dane1 > div:nth-child(2){
            text-align: right;
            float: left;
            width: 345px;
            margin-top: 35px;
            margin-right: 55px;
            height: 10px;
        }
        #dane2 > div{
            float: left;
            width: 350px;
            margin-top: 35px;
            margin-left: 35px;
            margin-right: 35px;
            height: 30px;
        }
        #breakStyle {
            height: 80px;
        }
        .tab{
            margin:2px;
        }
        .tab span:first-child{
            display: inline-block;
            width: 220px;
            background-color: lightgray;
            border-top: 1px solid gray;
            text-align: center;
        }
        #dane1 .tab span:last-child{
            display: inline-block;
            width: 220px;
            font-weight: bold;
            text-align: center;
        }
        table{
            font-size:8px;
            border-top: 1px solid gray;
            margin-top: 50px;
            margin-left: 47px;
            width: 695px;
        }
        table th{
            background-color: lightgray;
        }
        table th, table td{
            border-right: 1px solid gray;
        }
        table th:first-child, table td:first-child{
            border-left: 1px solid gray;
        }
        table tr:nth-child(even){
            background-color: rgb(255, 255, 255);
        }
        table tr:nth-child(odd){
            background-color: rgb(235, 235, 235);
        }
        </style>`
            html += `
            <div id="page">
            <div id="dane1">
                <div>
                    <img src="https://drive.google.com/uc?export=view&id=1g26yBfc-DxOFQsyoCWFuWyuStZJk5eb-" alt="QR" style="float: left; height: auto; width: 8em;"></img>
                    <span style="float: left; text-align: left; font-size: 2.5em; margin-left: 0.5em; margin-top: 0.4em;">
                        <span>Inventory</span><br />
                        <span margin-top: 0.2em;>Assistant</span><br />
                    </span>
                </div>
                <div>
                    <div class="tab">
                        <span>Raport z inwentaryzacji</span>
                    </div>
                    <div class="tab">
                        <span>Instytucja</span>
                        <span>${get_table.name}</span>
                    </div>
                    <div class="tab">
                        <span>Data</span>
                        <span>${table_data}</span>
                    </div>
                </div>
            </div>
            <div id='breakStyle'>
            </div>
            <div id="dane2">
                <table cellspacing="0">
                    <tr>
                        <th style="width:15px">Lp.</th>
                        <th >Kod QR</th>
                        <th >Nazwa</th>
                        <th >Ilość</th>
                        <th >Ilość Inw.</th>
                        <th >Właściciel</th>
                        <th >Data i godzina</th>
                    </tr>`;
                    get_positions.forEach((element, index) => {
                        const position_data = `${String(element.updated_at.getDate()).padStart(2, '0')}.${String(element.updated_at.getMonth() + 1).padStart(2, '0')}.${element.updated_at.getFullYear()} ${String(element.updated_at.getHours()).padStart(2, '0')}:${String(element.updated_at.getMinutes()).padStart(2, '0')}`;
                        html += `<tr>
                            <td style="text-align: center;">`+(index+1)+`</td>
                            <td style="text-align: center;">${element.qrCode}</td>
                            <td style="text-align: center;">${element.name}</td>
                            <td style="text-align: center;">${element.quantity}</td>
                            <td style="text-align: center;">${element.newQuantity}</td>
                            <td style="text-align: center;">${element.productOwner}</td>
                            <td style="text-align: center;">${position_data}</td>
                            </tr>`
                    })
            html+= `    
            </table>
            </div>
            </div>`;
            pdfBuffer(html)
                .then((pdfBuffer) => {
                    res.setHeader('Content-Disposition', 'attachment; filename=Raport'+nameIN+'.pdf');
                    res.setHeader('Content-Type', 'application/pdf');
            
                    res.send(pdfBuffer);
                    console.log('Udane wygenerowanie PDF.');
                })
                .catch((error) => {
                    console.error('Błąd generowania PDF:', error);
                });
    } catch (error) {
      console.error(`Error removing table: ${error}`);
      throw error;
    }
  }

  async function pdfBuffer(htmlCode) {
    return new Promise((resolve, reject) => {
        htmlToPdf.create(htmlCode, {}).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}


  module.exports = { createRaportWH, createRaportIN };