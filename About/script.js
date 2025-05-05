document.addEventListener("mousemove", (e) => {
    let x = (window.innerWidth / 2 - e.pageX) / 30;
    let y = (window.innerHeight / 2 - e.pageY) / 30;

    document.querySelector("#bg-glow").style.transform = `translate(${x}px, ${y}px)`;
    document.querySelector("#shape1").style.transform = `translate(${-x}px, ${-y}px) rotate(10deg)`;
    document.querySelector("#shape2").style.transform = `translate(${y}px, ${x}px) rotate(-10deg)`;
});
