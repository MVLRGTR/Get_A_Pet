function CalculateCepProximity(pets,userCep){
    let PetsByOrder =[]
    userCep = userCep.toString().slice(0,5)
    pets.map((pet)=>{
        petCep = pet.address.cep.toString().slice(0,5)
        pet.distance =  Math.abs(parseInt(userCep)- parseInt(petCep))
        PetsByOrder.push(pet)
    })
    PetsByOrder.sort((a,b)=> a.distance - b.distance)    
    return PetsByOrder
}
module.exports = CalculateCepProximity


