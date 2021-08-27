const {ApolloServer, gql} =  require('apollo-server');

// "models"

const typeDefs = gql`
    type Query {
        genesysOne: String
        getFathers:[Father]!
        getFatherById(id: String!):Father
    }

    type Father {
        _id  : ID!
        name : String!
        age  : Int!
        son  : Son
    }

    type Son {
        _id  : ID!
        name : String!
        age  : Int!
    }

    type Mutation {
        addFather (
            name: String!,
            age: Int!,
        ): Father!,
        
        addSon (
            FatherId: String!,
            name: String!,
            age: Int!,
        ): Son,

        removeFather(
            FatherId: String!
        ):Father, 
    }
`;

// nosso banco de dados

const fathers = [
    {_id:"0", name:"adam",age:99, son: {name:"Abel", age:22},skipSon:true},
    {_id:"1", name:"noah",age:35, son: {name:"Michael", age:19}}
]

// resolvers

const resolvers = {
    Query: {
        genesysOne: () => "In the beginning, God created the heavens and the earth.", //essa query retorna a mensagem
        getFathers: () => fathers,
        // argumentos: id do pai
        getFatherById: (_,args) => {
            return fathers.find((user)=> user._id === args.id)
        },
    },

    Mutation: {
        // argumentos: dados do pai
        addFather: (_,args) => {
            const newFather = {
                _id: String(fathers.length),
                name: args.name,
                age:args.age,
            };
            fathers.push(newFather);
            return newFather;
        },
        // argumentos: id do pai
        removeFather: (_,args) => {
            const father = fathers.find((user)=> user._id === args.FatherId)
            fathers.splice(parseInt(args.FatherId),1);
            return father
        },
        // argumentos: id do pai
        addSon: (_,args) => {
            const foundFather = fathers.find((user)=> user._id === args.FatherId)
            if (foundFather == null){ return foundFather }

            const newSon = {
                _id  : String(args.FatherId + "'" +'s son'),
                name : args.name,
                age  : args.age
            };

            const newFather = {
                _id  : String(args.FatherId),
                name : foundFather.name,
                age  : foundFather.age,
                son  : newson
            };

            fathers.splice(parseInt(args.FatherId),1,foundFather);
            return newSon;
        },
    },
};

// Ligando o servidor

const server = new ApolloServer({typeDefs,resolvers});
server.listen().then(({url}) => console.log(`server iniciado na url ${url}`));
