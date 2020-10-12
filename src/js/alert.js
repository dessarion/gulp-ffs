function target(){
  alert('Atension')
}

async function test() {
  await setTimeout(() => {
    console.log('done');
  }, 2000);
}