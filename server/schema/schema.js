const graphql = require('graphql');
const _ = require('lodash');

var athletes = [
    {id: '1', name: "Hayden Cox", dob: '09/12/92',  affiliation: 'RailRoad' , gender: 'Male'},
    {id: '2', name: "Mark Hadley", dob: '07/13/95',  affiliation: 'Furman' , gender: 'Male'},
    {id: '3', name: "Andrew Hunter", dob: '03/25/97',  affiliation: 'Walsh' , gender: 'Male'},
    {id: '4', name: "Shalane Flanagan", dob: '06/16/98',  affiliation: 'RailRoad' , gender: 'Female'}
];

var meets = [
    {id: '1', name: "Big Meet", date: '09/12/92',  organization: 'RailRoad' , location: 'Texas', entriesId: '1'},
    {id: '2', name: "Small Meet", date: '07/13/95',  organization: 'Furman' , location: 'South Carolina'},
    {id: '3', name: "The Big Meet", date: '03/25/97',  organization: 'Walsh' , location: 'Ohio'},
    {id: '4', name: "Raw Meet", date: '06/16/98',  organization: 'RailRoad' , location: 'Georgia'},
];

var entries = [
    {id: '1', meetId: '3', athleteId: '2', event: '1600m', time: '4:12.13'},
    {id: '2', meetId: '4', athleteId: '3', event: '800m', time: '2:12.09'},
    {id: '3', meetId: '1', athleteId: '4', event: '3000m', time: '9:12.13'},
    {id: '4', meetId: '2', athleteId: '1', event: '5000m', time: '14:23.10'}
]

const{GraphQLObjectType, 
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const AthleteType = new GraphQLObjectType({
    name: 'Athlete',
    fields: () =>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        dob: {type: GraphQLString},
        affiliation: {type: GraphQLString},
        gender: {type: GraphQLString},
        meet: {
            type: new GraphQLList(EntriesType),
            resolve(parent, args){
               return _.filter(entries, {athleteId: parent.id})
            }
        }
    })
});

const MeetType = new GraphQLObjectType({
    name: 'Meet',
    fields: () =>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        date: {type: GraphQLString},
        location: {type: GraphQLString},
        organization: {type: GraphQLString},
        entries: {
            type: new GraphQLList(EntriesType),
            resolve(parent, args){
               return _.filter(entries, {meetId: parent.id})
            }
        }
    })
});

const EntriesType = new GraphQLObjectType({
    name: 'Entries',
    fields: () =>({
        id: {type: GraphQLID},
        event: {type: GraphQLString},
        time: {type: GraphQLString},
        athlete: {
            type: AthleteType,
            resolve(parent, args){
                return _.find(athletes, {id: parent.athleteId});
            }
        },
        meet: {
            type: MeetType,
            resolve(parent, args){
                return _.find(meets, {id: parent.meetId});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        athlete: {
            type: AthleteType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //code to get data from db / other source.
                return _.find(athletes, {id: args.id});
            }
        },
        meet: {
            type: MeetType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(meets, {id: args.id});
            }
        },
        entries: {
            type: EntriesType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(entries, {id: args.id});
            }
        }
    })
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    // mutation: Mutation
})