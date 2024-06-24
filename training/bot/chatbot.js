const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
}); 
const fs = require('fs'); 
const brain = require('brain.js'); 
const net = new brain.recurrent.LSTM({ 
	activation: 'leaky-relu'
});


//Le o token

// use npm dotenv for a better way to handle this.
var token = JSON.parse(fs.readFileSync("./token/token.json", 'utf8'));


const channelID = "#"; // A specific channel ID for the bot to use.
const botID = "855737749357068308"; // *REQUIRED* The ID of the bot. 


// Chamando função quando o bot tiver preparado
client.on('ready', () => {
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	console.log('bot pronto');
});


// handler para as mensagens
client.on('message', msg => {
	
	if(msg.content == "") {
		return;
	}

	if (msg.author.id !== botID /*&& msg.channel.id === channelID*/) {
		
		var words = msg.content;
		
		var sentence = words.replace(/[^a-zA-Z ]+/g, "").toLowerCase();		

		msg.channel.send(reply(net.run(sentence)));
	}
});

//Login to Discord

client.login(token.token);


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
