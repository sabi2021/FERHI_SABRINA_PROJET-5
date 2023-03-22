function init(){

    try {
        const url = new URL(document.URL);
        const id = url.searchParams.get("orderId");
        if (!id) throw new Error('No orderId from URL');
        
        const element = document.querySelector("#orderId");
        element.innerHTML = id;

    } catch (error) {
        alert('Impossible de procéder à la récupération du numéro de commande');
        console.error(error);
    }
    
    
}

init();