'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []
const setLocalStorage = (dbFuncionario) => localStorage.setItem("db_funcionario", JSON.stringify(dbFuncionario))

// CRUD - create read update delete
const deleteFUncionario = (index) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario.splice(index, 1)
    setLocalStorage(dbFuncionario)
}

const updateFuncionario = (index, funcionario) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario[index] = funcionario
    setLocalStorage(dbFuncionario)
}

const readFuncionario = () => getLocalStorage()

const createFuncionario = (funcionario) => {
    const dbFuncionario = getLocalStorage()
    dbFuncionario.push (funcionario)
    setLocalStorage(dbFuncionario)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveFuncionario = () => {
    debugger
    if (isValidFields()) {
        const funcionario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createFuncionario(funcionario)
            updateTable()
            closeModal()
        } else {
            updateFuncionario(index, funcionario)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (funcionario, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.email}</td>
        <td>${funcionario.celular}</td>
        <td>${funcionario.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableFuncionario>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableFuncionario>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbFuncionario = readFuncionario()
    clearTable()
    dbFuncionario.forEach(createRow)
}

const fillFields = (funcionario) => {
    document.getElementById('nome').value = funcionario.nome
    document.getElementById('email').value = funcionario.email
    document.getElementById('celular').value = funcionario.celular
    document.getElementById('cidade').value = funcionario.cidade
    document.getElementById('nome').dataset.index = funcionario.index
}

const editFuncionario = (index) => {
    const funcionario = readFuncionario()[index]
    funcionario.index = index
    fillFields(funcionario)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editFuncionario(index)
        } else {
            const funcionario = readFuncionario()[index]
            const response = confirm(`Deseja realmente excluir o Funcionario ${funcionario.nome}`)
            if (response) {
                deleteFuncionario(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarFuncionario')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveFuncionario)

document.querySelector('#tableFuncionario>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)