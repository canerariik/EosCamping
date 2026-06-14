function generateKod() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let kod = "";
    for (let i = 0; i < 3; i++) 
        kod += letters.charAt(Math.floor(Math.random() * letters.length));
    return `eos-${kod}`;
}

module.exports = generateKod;
