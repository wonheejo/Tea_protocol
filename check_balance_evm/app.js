require("dotenv").config();
const ansi = require('ansicolor').nice;
const log = require('ololog').configure
({
  time: true,
  locate: true,
  tag: true
});
const Web3 = require('web3');
const BN = require('bn.js');
const fs = require('fs');

console.log(Web3.version);


const mainnet = 'https://api.wemix.com';
const testnet = 'https://api.test.wemix.com';
const network = process.env.NETWORK || 'mainnet';
const block = process.env.BLOCK || 'latest';
const toWei = process.env.TO_WEI === "true";
const toCheckSumAddress = process.env.TO_CHECKSUM_ADDRESS === "true";
const logAddress =process.env.LOG_ADDRESS === "true";
const rpcUrl = network.toLowerCase() === 'mainnet'? mainnet:testnet;



log.info(ansi.yellow('Configuration'));
log.info.indent (1)(`NETWORK : ${ansi.bright.green(network)}`);
log.info.indent (1)(`OPENAPI URL : ${ansi.bright.green(rpcUrl)}`);
log.info.indent (1)(`TO WEI : ${ansi.bright.green(toWei)}`);
log.info.indent (1)(`TO CHECKSUM Address : ${ansi.bright.green(toCheckSumAddress)}`);
log.info.indent (1)(`Log Address : ${ansi.bright.green(logAddress)}`);
log.info(ansi.yellow('Initialized...'));

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

async function getBalnaceBatch(addresslist , searchBlock, outputFile, isWei, isChecsum){
    
    const iterator = addresslist.values();
    let batch = new web3.BatchRequest();
    // console.log(`=>addr size(${addresslist.length})`);
    for (const addr of iterator) {
        // console.log(`=>${addr}`);
        if(!addr) {
            continue;
        }
        // console.log(`=>${addr} / ${searchBlock}`);
        batch.add(web3.eth.getBalance.request(addr, searchBlock,(err,balance) =>{

            let msg = `${isChecsum?addr:addr.toLowerCase()}, ${isWei?balance:Web3.utils.fromWei(balance, 'ether')}`;
            if(outputFile){
                fs.writeFileSync(outputFile,msg+'\n',{flag:"a"});
            }
            if (logAddress) {
                log.info.indent (1)(`${ansi.bright.white(isChecsum?addr:addr.toLowerCase())}, ${ansi.bright.white(isWei?balance:Web3.utils.fromWei(balance, 'ether'))}`);
            }

        }));
    }
    
    batch.execute();
}
function isNum(val){
    return !!Number(val)
  }

async function main(inputfile){
    log.info.indent (1)(`ADDRESSES FILE : ${inputfile}`);
    
    // let latest = await web3.eth.getBlockNumber();
    // console.log(latest);
    let block_number = 0;
    if (block.toLowerCase() === 'latest'){
        log.info(ansi.yellow('Get Latest Block Number...'));
        block_number = await web3.eth.getBlockNumber();
    
    } else {
        if(isNum(block)){
            block_number = block;
        } else {
            log.error(ansi.red(`Not Support BLOCK NUMBER: ${block}`));
            process.exit(0)
        }
    }
    let outputFile = `output/result_${block_number}.${Date.now()}.csv`;
 
    log.info.indent (1)(`BLOCK_NUMBER : ${block_number}`);
    log.info.indent (1)(`OUTPUT FILE : ${outputFile}`);
 
    
    let addresslist = fs.readFileSync(inputfile).toString().split("\n");
    addresslist = addresslist.map(s => s.trim()); // get rid of empty space before and after the string
    // log.info(`${block_number}, ${outputFile}, ${toWei}, ${toCheckSumAddress}`);
    await getBalnaceBatch(addresslist,block_number,outputFile,toWei,toCheckSumAddress);
}

const INPUT_FILE = process.argv[2]|| process.env.INPUT_FILE
if(!INPUT_FILE){
    log.error(ansi.red(`Not FOUND INPUT FILE: ${INPUT_FILE}`));
    process.exit(0)
}else {
    try {
        fs.statSync(INPUT_FILE);
    }catch (error){
        if(error.code ==='ENOENT'){
            log.error(ansi.red(`Not EXIST INPUT FILE: ${INPUT_FILE}`));
            process.exit(0)
        }
    }    
}
    
// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);

// })


main(INPUT_FILE).then(function (err) {
    log.info(ansi.yellow(`Waitting...`));
}).catch(function (err) {
    log.error(ansi.red(`Rejected`));
    log.error(err);
});

