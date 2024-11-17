const axios = require("axios");

const BACKEND_URL = "https://localhost:3000"



describe("Authentication", () => {
  
  test('User is able to sign up only once', async () => {
    const username = "sumit" + Math.random();
    const password = "123456";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    })

    expect(response.statusCode).toBe(200)
    
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username, 
      password, 
      type: "admin"
    })

    expect(updatedResponse.statusCode).toBe(400);
  });

  test('Sigup request fails if the username is empty', async () => {
    const username = `sumit-${Math.random()}`
    const password = "123456"
    
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password
    })
    
    expect(response.statusCode).toBe(400)
  })

  test('Signin succeeds if the username and password are correct', async () => {
    const username = `sumit-${Math.random()}`
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/v2/signup`, {
      username, 
      password
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username, 
      password
    }); 

    expect(respone.statusCode).toBe(200)
    expect(response.body.token).toBeDefined()
  })

  test('Signin fails if the username and password are incorrect', async() => {
    const username = `sumit-${Math.random()}`
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password
    })

    expect(response.statusCode).toBe(403)
  })
})

describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = ""

  beforeAll(async () => {
    const username = `sumit-${Math.random}`
    const password = "123456"

    await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    const response = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password        
    })

    token = response.data.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      "name": "Timmy"        
    })

    avatarId = avatarResponse.data.avatarId;
  })

  test("User can update their metadata with a wrong avatar id", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user.metadata`, {
       avatarId: "123123123"
    }, {
      headers: {
        "authorization": `Bearer ${token}` 
      }
    })

    expect(response.statusCode).toBe(400)
  }) 

  test("User can update their metadata with the right avatar id", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user.metadata`, {
      avatarId  
    }, {
      headers: {
        "authorization": `Bearer ${token}` 
      }
    })

    expect(response.statusCode).toBe(200)
  })

  test("User is not able to update their metadata if the auth header is not present", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user.metadata`, {
      avatarId  
    });

    expect(response.statusCode).toBe(403)
  });
});

describe("User avatar information", () => {
  let avatarId; 
  let token; 
  let userId;
  beforeAll(async () => {
    const username = `sumit-${Math.random}`
    const password = "123456"

    const signupResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    userId = signupResponse.data.userId

    const response = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password        
    })

    token = response.data.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      "name": "Timmy"        
    })

    avatarId = avatarResponse.data.avatarId;
  })

  test("Get back avatar information for a  user", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

    expect(response.data.avatars.length).toBe(1);
  })
})

describe("Space information", () => {
  let mapdId;
  let element1Id;
  let element2Id;
  let adminToken; 
  let adminId;
  let userToken; 
  let userId;

  beforeAll( async () => {
    const username = `sumit-${Math.random}`
    const password = "123456"

    const signupResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    adminId = signupResponse.data.userId

    const response = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password        
    })

    adminToken = response.data.token 

    const UserSignupResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password,
      type: "user"
    });

    userId = userSignupResponse.data.userId

    const userSigninResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password        
    })

    userToken = userSigninResponse.data.token 

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true 
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    });

    const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true 
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    element1Id = element1.id 
    element2Id = element2.id 

    const map = await axious.post(`${ BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": [{
          elementId: element1Id,
          x: 20,
          y: 20
        }, {
          elementId: element1Id,
          x: 18,
          y: 20
        }, {
          elementId: element2Id,
          x: 19,
          y: 20
        }, {
          elementId: element2Id,
          x: 19,
          y: 20
        }
      ]
   }, {
    headers: {
      authorization: `Bearer ${adminToken}`
    }
   })
   
    mapID = map.id
  });

  test("User is able to create a space", async() => {
    const respone = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
      "mapId": "mapId"
   }, {
    headers: {
      authorization: 'Bearer ${userToken}'
    }
   })

   expect(respone.spaceId).toBeDefined()
  })

  test("User is able to create a space without mapId (empty space)", async() => {
    const respone = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
   }, {
    headers: {
      authorization: 'Bearer ${userToken}'
    }
   })

   expect(respone.spaceId).toBeDefined()
  })

  test("User is not able to create a space without mapId and dimensions", async() => {
    const respone = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
   }, {
    headers: {
      authorization: 'Bearer ${userToken}'
    }
   })

   expect(respone.statusCode).toBe(400)
  })

  test("User is not able to delete a space that doesn't exist", async() => {
    const respone = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
      headers: {
        authorization: 'Bearer ${userToken}'
      }
    })
    expect(respone.statusCode).toBe(400)
  })

  test("User is able to delete a space that does exist", async() => {
    const respone = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
      "name": "Test",
      "dimensions": "100x200",
    }, {
      headers: {
        authorization: 'Bearer ${userToken}'
      }
    })

    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      headers: {
        authorization: 'Bearer ${userToken}'
      }
    })

    expect(respone.statusCode).toBe(200)
  })

  test("User should not be able to delete a space created by another user", async () => {
const respone = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
      "name": "Test",
      "dimensions": "100x200",
    }, {
      headers: {
        authorization: 'Bearer ${userToken}'
      }
    })

    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      headers: {
        authorization: 'Bearer ${adminToken}'
      }
    })

    expect(respone.statusCode).toBe(403)
  })

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: 'Bearer ${adminToken}'
      }
    });
    expect(response.data.spaces.length).toBe(0)
  }) 

  test("Admin has gets once space after", async () => {
    const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space/`, {
      "name": "Test",
      "dimensions": "100x200",
    }, {
      headers: {
        authorization: 'Bearer ${adminToken}'
      }
    });

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: 'Bearer ${userToken}'
      }
    });
    const filteredSpace = response.data.spcaes.find(x => x.id == spaceCreateResponse.spaceId)
    expect(response.data.spaces.length).toBe(1)
    expect(filteredSpace).toBeDefined()
  }) 
})

describe("Arena endpoints", () => {
  let mapdId;
  let element1Id;
  let element2Id;
  let adminToken; 
  let adminId;
  let userToken; 
  let userId;
  let spaceId;

  beforeAll( async () => {
    const username = `sumit-${Math.random}`
    const password = "123456"

    const signupResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    adminId = signupResponse.data.userId

    const response = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username: username,
      password        
    })

    adminToken = response.data.token 

    const UserSignupResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password,
      type: "user"
    });

    userIdId = userSignupResponse.data.userId

    const userSigninResponse = await axios.post(`{BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password        
    })

    userToken = userSigninResponse.data.token 

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true 
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    });

    const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true 
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    element1Id = element1.id 
    element2Id = element2.id 

    const map = await axious.post(`${ BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": [{
          elementId: element1Id,
          x: 20,
          y: 20
        }, {
          elementId: element1Id,
          x: 18,
          y: 20
        }, {
          elementId: element2Id,
          x: 19,
          y: 20
        }, {
          elementId: element2Id,
          x: 19,
          y: 20
        }
      ]
   }, {
    headers: {
      authorization: `Bearer ${adminToken}`
    }
    })
    
    mapId = map.id

    const spaceId = await axios.post(`${BACKEND_URL}/api/v1/`, {
      "name": "Test",
      "dimensions": "100x200",
      "mapId": mapId
    }, {
      headers: {
        "Authorization": `Bearer ${userToken}`
      }
    })

    spaceId = space.spaceId
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`);
    expect(response.statusCode).toBe(400)
  })

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);
    expect(response.data.dimensions).toBe("100x200")
    expect(response.data.elements.length).toBe(3)
  })

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId, 
      elementId: response.data.elements[0].id
    });
    
    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    expect(newResponse.data.elements.length).toBe(2)
  })

  test("Adding an elemet works as expected", async () => {
    await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      "elementId": element1Id,
      "spaceId": spaceId,
      "x": 50,
      "y": 20
    });
    
    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    expect(newResponse.data.elements.length).toBe(3)
  })

  test("Adding an elemet fails if the element lies outside the dimensions", async () => {
    await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      "elementId": element1Id,
      "spaceId": spaceId,
      "x": 10000,
      "y": 210000
    });

    expect(newResponse.statusCode).toBe(404)
  })
  test("Adding an element works as expected", async () =>){
    await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      "elemetID": element1Id,
      "spaceID": spaceId,
      "x": 50,
      "y": 20
    });

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    expect(newResponse.data.elements.length).toBe(3)
  }
})
