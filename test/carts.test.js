import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

const requester = supertest('http://localhost:4000');

//Test carts
describe("Testing de las rutas de carts", () => {
    let token = ""
    let cartId = ""   

  //REGISTER
    it("Ruta: api/session/register con el metodo POST", async function () {
        const newUser = {
            first_name: "Test",
            last_name: "user",
            email: "test@user.com",
            password: "testuser"
        }

        const { _body, status } = await requester.post('/api/session/register').send(newUser)

        //Comprueba si el status es 200        
        expect(status).to.equal(200)
        //expect(_body.status).to.equal("success");
        console.log("Ruta de registro")
        console.log(`Status: ${_body.status}`)
    })    
    //Login con usuario normal
    it("Ruta: api/session/login con el metodo POST", async function () {
        const newUser = {
            email: "test@user.com",
            password: "testuser"
        }

        const response = await requester.post('/api/session/login').send(newUser)
        const tokenResult = response.headers['set-cookie'][0]

        //Verifica que exista la token en la respuesta
        expect(tokenResult).to.be.ok

        token = {
            name: tokenResult.split("=")[0],
            value: tokenResult.split("=")[1],
        }

        //Comprueba que el status es 200
        expect(response.status).to.equal(200)


        console.log("Ruta de login")
        console.log(`Status: ${response.body.status}`)
        console.log(`Message: ${response.body.message}`)


        //Verifica el nombre y el valor de la Token
        expect(token.name).to.be.ok.and.equal('jwtCookies')
        expect(token.value).to.be.ok

        console.log(`Token: ${token.name} = ${token.value}`)
    })

    it("Ruta: api/session/current con el metodo GET", async function () {

        const response = await requester
        .get('/api/session/current')
        .set('Cookie', [`${token.name}=${token.value}`])

        //Verifica que exista la token en la respuesta
        expect(response.status).to.equal(200)

        cartId =  response.body.user.idCart
        //Comprueba que el status es 200
        expect(response.body).to.be.ok;
    })

    //Ingresa un producto al carrito por el Id 2
    it("Ruta: api/carts/cid/product/pid con el metodo POST", async function () {
        const cid = cartId
        const pid = "64168ea7ec39e0132293a814"

        await requester
            .post(`/api/carts/${cid}/products/${pid}`)
            .set('Cookie', [`${token.name}=${token.value}`])

        const { _body, status } = await requester
            .post(`/api/carts/${cid}/products/${pid}`)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(status).to.equal(200);

        console.log("Agregar el mismo producto 2 veces")
        console.log(`producto: ${_body.products[0].productId}`)
    })    

    //Obtiene el carrito con el array de productos vacío
    it("Ruta: api/carts/cid con el metodo GET", async function () {
        const cid = cartId

        const { _body, status } = await requester
            .get(`/api/carts/${cid}`)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(status).to.equal(200);

        console.log("Ruta para Obtener el carrito")
        console.log("Status:", JSON.stringify(_body, null, 2))         
    })

    //Actualiza los productos del carrito con un array
    it("Ruta: api/carts/cid con el metodo PUT", async function () {
        const cid = cartId

        const products = [
            {
                productId: "6417ebfce3d8a5fce3779b7b",
                quantity: 2
            },
            {
                productId: "6417ec59e3d8a5fce3779b7d",
                quantity: 5
            },
            {
                productId: "6418d4bccf34d1a30f51e0fa",
                quantity: 1
            },
            {
                productId: "6418d4bccf34d1a30f51e0fb",
                quantity: 10
            }
        ]

        const { _body, status } = await requester
            .put(`/api/carts/${cid}`)
            .send(products)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(status).to.equal(200);

        console.log("Ruta para modificar el array de productos del carrito.")
        console.log("Status:", JSON.stringify(_body, null, 2))           
    })

    //Actualiza la cantidad de un producto
    it("Ruta: api/carts/cid/product/pid con el metodo PUT", async function () {
        const cid = cartId
        const pid = "6418d4bccf34d1a30f51e0fa"
        const newQuantity = { quantity: "5" }

        const { _body, status } = await requester
            .put(`/api/carts/${cid}/products/${pid}`)
            .send(newQuantity)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(status).to.equal(200);        

        console.log("Ruta para actualizar la cantidad de un producto dentro del carrito")
        console.log("Status:", JSON.stringify(_body, null, 2)) 
    })

    //Actualiza la cantidad de un producto
    it("Ruta: api/carts/cid/product/pid con el metodo PUT", async function () {
        const cid = cartId
        const pid = "6418d4bccf34d1a30f51e0fa"
        const newQuantity = { quantity: "99999999" }

        const { _body, status } = await requester
            .put(`/api/carts/${cid}/products/${pid}`)
            .send(newQuantity)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(status).to.equal(200);

        console.log("Ruta para actualizar la cantidad sin suficiente stock")
        console.log("Status:", JSON.stringify(_body, null, 2)) 
    })

})