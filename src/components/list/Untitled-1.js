
function task() {
    setTimeout(function () {
        console.log('1');
    });
    new Promise(resolve => {
        console.log('2');
        resolve();
    }).then(() => {
        console.log('3');
    }).then(() => {
        console.log('4');
    });
    console.log('5');
}

async function asyncFuncton() {
    console.log(0);
    
    setTimeout(() => {
        console.log(1);
    }, 0);

    await new Promise(resolve => {
        setTimeout(() => {
            console.log(2);
        }, 0);

        console.log(3);

        setTimeout(() => {
            console.log(4);

        }, 1000);

        setTimeout(() => {
            console.log(5);
        }, 0);
    });

    setTimeout(() => {
        console.log(6);
    }, 0);
    console.log(7);
}

asyncFuncton()

03125476
