const baseUrl = `http://localhost:3000`

$( document ).ready(function() {
    auth()
    $('#errorTitle').hide()
    $('#errorPrice').hide()
    $('#errorIngredients').hide()
    $('#errorLogin').hide()
})


const login = (e) => {
    e.preventDefault()
    const email = $('#exampleInputEmail1').val()
    const password = $('#exampleInputPassword').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/login',
        data: {
            email,
            password
        }
    })
    .done(data => {
        $('#exampleInputPassword').val('')
        localStorage.setItem('access_token', data.token)
        $('#errorLogin').hide()
        auth()
        console.log(data)
    })
    .fail(err => {
        console.log(err.responseJSON.errors)
        $('#errorLogin').empty()
        $('#errorLogin').append(err.responseJSON.errors[0].message)
        $('#errorLogin').show()
    })

}

const logout = (e) => {
    e.preventDefault()
    localStorage.clear()
    auth()
}

const auth = () => {
    console.log(localStorage.access_token)
    if (localStorage.access_token) {
        $('#login').hide()
        $('#main').show()
        readFood()
    } else {
        $('#login').show()
        $('#main').hide()
    }
}

const addFood = (e) => {
    e.preventDefault()
    $('#errorTitle').hide()
    $('#errorPrice').hide()
    $('#errorIngredients').hide()
    const title = $('#title').val()
    const price = $('#price').val()
    const ingredients = $('#ingredients').val()
    const tag = $('#tag').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/foods',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title,
            price,
            ingredients,
            tag
        }
    })
    .done(data => {
        console.log(data)
        $('#title').val('')
        $('#price').val('')
        $('#ingredients').val('')
        $('#errorTitle').hide()
        $('#errorPrice').hide()
        $('#errorIngredients').hide()
        readFood()
    })
    .fail(err => {
        if (err.responseJSON) {
            err.responseJSON.errors.forEach(el => {
                if (el.message == 'Validation notEmpty on title failed' ) {
                    $('#errorTitle').show()
                } else if (el.message == 'Validation notEmpty on price failed' ) {
                    $('#errorPrice').show()
                } else if (el.message == 'Validation notEmpty on ingredients failed' ) {
                    $('#errorIngredients').show()
                }
                console.log(el)
            })
        } else {
            console.log(err)
        }
            
        


    })
}


const readFood = () => {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/foods',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        $('#foodContent').empty()
        let appends = ''
        data.result.forEach(el => {
            console.log(el)
            appends += `
            <div class="card">
              <div class="card-body pb-0">
                <div class="d-flex justify-content-between mb-0">
                  <div class="col-9">
                    <h5 class="font-weight-bold">${el.title}</h5>
                    <p>Rp.${el.price}</p>
                  </div>
                  <div class="col-3 d-flex align-items-baseline">
                    <i class="fas fa-tag text-grey mr-2"></i>
                    <p class="text-grey">${el.tag}</p>
                    <button class="fas fa-trash text-danger ml-auto cursor-pointer" onclick="deleteFood(event, ${el.id})"></button>
                  </div>
                </div>
                <div class="card-body border-bottom">${el.ingredients}</div>
              </div>
            `
        })
        $('#foodContent').append(appends)
    })
    .fail(err => {
        console.log(err.responseJSON)
    })
}

const deleteFood = (e, id) => {
    e.preventDefault()
    $.ajax({
        method: 'DELETE',
        url: baseUrl + `/foods/${id}`,
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        readFood()
    })
    .fail(err => {
        console.log(err.responseJSON)
    })
}