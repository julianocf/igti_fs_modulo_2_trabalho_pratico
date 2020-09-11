import { promises as fs, promises } from "fs";

let globalStatesJson = "";
let globalCitiesJson = "";

async function main() {

    await readFiles();

    console.log("Criando arquivos individuais de cada estado...")
    await createStateCitiesFiles();
    
    console.log("Exibindo os 5 estados com mais cidades:")
    await printStatesWithMoreCities();
    
    console.log("Exibindo os 5 estados com menos cidades:")
    await printStatesWithLessCities();

    console.log("Cidades com nomes mais longos:")
    await printCitiesWithLongestNames();
    
    console.log("Cidades com os nomes mais curtos:")
    await printCitiesWithSmallestNames();

    console.log("Cidade com o nome mais longo:")
    await printCityWithLongestName();

    console.log("Cidade com o nome mais curto:")
    await printCityWithSmallestName();
    
}

// Leitura dos arquivos e atribuição as variáveis globais
const readFiles = async () => {
    try {
        globalStatesJson = await fs.readFile("./resources/Estados.json", "utf-8");
        globalStatesJson = JSON.parse(globalStatesJson);
        globalCitiesJson = await fs.readFile("./resources/Cidades.json", "utf-8");
        globalCitiesJson = JSON.parse(globalCitiesJson);
    } catch (err) {
        console.log(err);
    }    
}

// Lê o arquivo com as cidades correspondente ao estado passado
const getCitiesFromState = async (stateAbreviation) => {
    try {
        let cities = await fs.readFile(`./assets/${stateAbreviation}.json`, "utf-8");
        return JSON.parse(cities);  
    } catch (err) {
        console.log(err);
    }    
}

// Soma as cidades para cada estado
const sumCitiesForAllStates = async () => {
    try {
        let stateCitiesCount = [];

        for (const state of globalStatesJson) {           
            stateCitiesCount.push({name: state.Sigla, ammount: await sumCitiesByState(state.Sigla)});
        }

        return stateCitiesCount;

    } catch (err) {
        console.log(err);
    } 
}

// retorna as cidades com menor nome de cada estado
const getCitiesWithSmallestNames = async () => {
    try {
        let smallestNames = [];
        let cities = null;

        for (const state of globalStatesJson) {  
            cities = await getCitiesFromState(state.Sigla);
            cities.sort((a, b) => { return a.Nome.length - b.Nome.length });            
            smallestNames.push({ name: cities[0].Nome, state: state.Sigla });
        }

        return smallestNames;

    } catch (err) {
        console.log(err);
    } 
}

// retorna as cidades com maior nome de cada estado
const getCitiesWithLongestNames = async () => {
    try {
        let longestNames = [];
        let cities = null;
    
        for (const state of globalStatesJson) {  
            cities = await getCitiesFromState(state.Sigla);
            cities.sort((a, b) => { return b.Nome.length - a.Nome.length });            
            longestNames.push({ name: cities[0].Nome, state: state.Sigla });
        }
    
        return longestNames;
    
    } catch (err) {
        console.log(err);
    }
}

// 1. Criar uma função que irá criar um arquivo JSON para cada estado representado no
// arquivo Estados.json, e o seu conteúdo será um array das cidades pertencentes a
// aquele estado, de acordo com o arquivo Cidades.json. O nome do arquivo deve ser
// o UF do estado, por exemplo: MG.json.
const createStateCitiesFiles = async () => {
    try {
        let stateCities = null;

        for (const state of globalStatesJson) {           
            stateCities = globalCitiesJson.filter(
                city => city.Estado === state.ID
            );
            await fs.writeFile( `./assets/${state.Sigla}.json`, JSON.stringify(stateCities), "utf-8" );  
        }

        console.log("Arquivos criados com sucesso!");

    } catch (err) {
        console.log(err);
    }    
}

// 2. Criar uma função que recebe como parâmetro o UF do estado, realize a leitura do
// arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.
const sumCitiesByState = async (stateAbreviation) => {
    try {
        let cities = await getCitiesFromState(stateAbreviation);

        return cities.length;

    } catch (err) {
        console.log(err);
    }   
}

// 3. Criar um método que imprima no console um array com o UF dos cinco estados
// que mais possuem cidades, seguidos da quantidade, em ordem decrescente. Você
// pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 93”, “UF - 82”,
// “UF - 74”, “UF - 72”, “UF - 65”]
const printStatesWithMoreCities = async () => {
    try {

        let stateCitiesCount = await sumCitiesForAllStates();
        let states = []

        stateCitiesCount.sort((a, b) => { return b.ammount - a.ammount });

        stateCitiesCount = stateCitiesCount.slice(0, 5);

        states = stateCitiesCount.map( (count) => {
            return `${count.name} - ${count.ammount}`
        });

        console.log(states);

    } catch (err) {
        console.log(err);
    }    
}

// 4. Criar um método que imprima no console um array com o UF dos cinco estados
// que menos possuem cidades, seguidos da quantidade, em ordem decrescente.
// Você pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 30”, “UF
// - 27”, “UF - 25”, “UF - 23”, “UF - 21”]
const printStatesWithLessCities = async () => {
    try {

        let stateCitiesCount = await sumCitiesForAllStates();
        let states = []

        stateCitiesCount.sort((a, b) => { return a.ammount - b.ammount });

        stateCitiesCount = stateCitiesCount.slice(0, 5);
        
        states = stateCitiesCount.sort((a, b) => { 
            return b.ammount - a.ammount 
        }).map( (count) => {
            return `${count.name} - ${count.ammount}`
        });

        console.log(states);

    } catch (err) {
        console.log(err);
    }    
}

// 5. Criar um método que imprima no console um array com a cidade de maior nome de
// cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome da
// Cidade – UF”, ...].
const printCitiesWithLongestNames = async () => {
    try {
        let longestNames = await getCitiesWithLongestNames();

        longestNames = longestNames.map((city) => { 
            return `${city.name} - ${city.state}`
        });

        console.log(longestNames);

    } catch (err) {
        console.log(err);
    } 
}

// 6. Criar um método que imprima no console um array com a cidade de menor nome
// de cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome
// da Cidade – UF”, ...].
const printCitiesWithSmallestNames = async () => {
    try {
        let smallestNames = await getCitiesWithSmallestNames();

        smallestNames = smallestNames.map((city) => { 
            return `${city.name} - ${city.state}`
        });

        console.log(smallestNames);

    } catch (err) {
        console.log(err);
    } 
}


// 7. Criar um método que imprima no console a cidade de maior nome entre todos os
// estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF".
const printCityWithLongestName = async () => {
    try {
        let longestNames = await getCitiesWithLongestNames();
        let city = null;
        
        city = longestNames.sort((a,b) => { 
            return b.name.length - a.name.length || a.name.localeCompare(b.name)
        }).slice(0,1)[0];
        
        console.log( `${city.name} - ${city.state}` );

    } catch (err) {
        console.log(err);
    } 
}

// 8. Criar um método que imprima no console a cidade de menor nome entre todos os
// estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF"
const printCityWithSmallestName = async () => {
    try {
        let smallestNames = await getCitiesWithSmallestNames();
        let city = null;
        
        city = smallestNames.sort((a,b) => { 
            return a.name.length - b.name.length || a.name.localeCompare(b.name)
        }).slice(0,1)[0];
        
        console.log( `${city.name} - ${city.state}` );
        
    } catch (err) {
        console.log(err);
    } 
}

main();