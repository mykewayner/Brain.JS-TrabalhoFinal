const fs = require('fs');
const brain = require('brain.js');
const net = new brain.recurrent.LSTM({
	activation: 'leaky-relu'
});
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var trainingData = [];


function loadInitialTraining()
{
	train(JSON.parse(fs.readFileSync('conversation-data.json')));
}



// Criação da rede neural pra treinamento
function loadTraining()
{
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	train(JSON.parse(fs.readFileSync('conversation-data.json')));
}

function saveTrainingData()
{
	try {
		fs.writeFile('neuralnet.json', JSON.stringify(net.toJSON()), (err, result) => {
			if(err) console.log("error:" + err);
		});
	}catch(err){
		console.log(err);
	}
}


function testTrainingModel()
{
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	boot();
}


const train = (dt) => {
	
	console.log("Training.");
	
	const d = new Date();
	
	net.train(dt, {
		iterations: 500,
		log: true,
		errorThresh: 0.001,
		logPeriod: 50,
		momentum: 0.1,
		learningRate: 0.001
	});
	
	saveTrainingData();
	
	console.log(`Finished in ${(new Date() - d) / 1000} s`);
}




//Le a resposta do usuário e pega o id do output
const boot = () => {
	rl.question("Enter: ", (q)=>{
		var qs = q.replace(/[^a-zA-Z ]+/g, "").toLowerCase();
		console.log(resposta(net.run(qs)));
		boot();
	});
}



// Respostas
var res_oi = ["E ai","Olá","Oi","eae","salve"];
var res_despedida = ["Até mais","Adeus","Tchau", "Boa noite bruno"];
var res_hora = ["Compra em relógio"];
var res_clima = ["Que dia bonito","Como ta o céu?","thats perfect weather"];
var res_sim = ["Creio que não","Tá bom então","Concordo"];
var res_nao = ["pq não?","NÃO!","SIM!","tá bom então","Otário"];
var res_ajuda = ["Eu gostaria de ajudá-lo mas sou apenas um robô","Tem alguem que pode lhe ajudar?","Gostaria de ajudá-lo, mas não posso."];
var res_perguntaGenerica = ["Não tenho preferencia","Sei lá","Não curto"];

// Retorna resposta de acordo com o output
const resposta = (intent) => {
	
	if(intent === "") return ":thinking:";
	
	var retstr = "";

	switch(parseInt(intent)) {
		case 1:
			retstr = res_oi[Math.floor(Math.random()*res_oi.length)];
		break;
		case 2:
			retstr = res_despedida[Math.floor(Math.random()*res_despedida.length)];
		break;
		case 3:
			retstr = res_hora[Math.floor(Math.random()*res_hora.length)];
		break;
		case 4:
			retstr = res_clima[Math.floor(Math.random()*res_clima.length)];
		break;
		case 5:
			retstr = res_sim[Math.floor(Math.random()*res_sim.length)];
		break;
		case 6:
			retstr = res_nao[Math.floor(Math.random()*res_nao.length)];
		break;
		case 7:
			retstr = cumprimento();
		break;
		case 8:
			retstr = res_ajuda[Math.floor(Math.random()*res_ajuda.length)];
		break;
		case 9:
			retstr = res_perguntaGenerica[Math.floor(Math.random()*res_perguntaGenerica.length)];
		break;
		default:
			retstr = ":thinking:";
		break;
	}
	
	return retstr;
}



//Cria uma frase aleatoria        
const cumprimento = () => {

	var terms = ["Como você esta?","Como vai?","Como está indo?"];
	var str = "";
    str += terms[Math.floor(Math.random() * terms.length)] + " ";
    
	
	str += "Estou ";

	if(Math.random() >= 0.7)
	{
		var things = ["me sentindo ","genuínamente ","incrívelmente "];
		str += things[Math.floor(Math.random()*things.length)];
	}
	
    var feelings = ["bem. ","calmo. ","mal. ","confiante. ","triste. ","ansioso. ",
        "nervoso. ","apático. ","estressado. "];
            
	str += feelings[Math.floor(Math.random()*feelings.length)];
	

    if(Math.random() >= 0.5)
    {
        str += "obrigado por perguntar. ";
    } else {
       str += ". ";
    }
    
    return str;
}


//Starta
const init = () =>
{
	loadInitialTraining();
	//loadTraining();
	//testTrainingModel();
}
init();
