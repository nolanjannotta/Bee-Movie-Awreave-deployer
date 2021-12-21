const fs = require('fs')

const key = require('../keyfile/keyfile.json');

const Arweave = require('arweave');
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});


const accountDetails = async () => {
    let address = await arweave.wallets.jwkToAddress(key)
    let balance = await arweave.wallets.getBalance(address)


    console.log("deployer adddress", address);
    console.log("deployer balance:", arweave.ar.winstonToAr(balance))
    

    
}

const makeTransaction = async () => {
    const beeMovie = fs.readFileSync('bee-movie.html');

    
    let transaction = await arweave.createTransaction({ data: beeMovie }, key);
    transaction.addTag('Content-Type', 'text/html');

    await arweave.transactions.sign(transaction, key);

    let uploader = await arweave.transactions.getUploader(transaction);
    console.log("deploying 'bee-movie.html'...")

    while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
}

accountDetails()
makeTransaction()
