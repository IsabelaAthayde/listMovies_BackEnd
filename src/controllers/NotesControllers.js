const knex = require('../database/knex');
const sqliteConnection = require("../database/sqlite/");
const AppError = require('../utils/AppError');


class NotesControllers {
    async create(request, response) {
        const { title, description, rating, tags} = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const movieNotesExists = await database.get("SELECT * FROM movieNotes WHERE title = (?) ", [title])

        if(movieNotesExists) {
            throw new AppError(`Já existe uma nota do filme ${title}`)
        }

        const note_id = await knex("movieNotes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                user_id,
                name
            }
        })

        await knex("tags").insert(tagsInsert)
    
        return response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("movieNotes").where({ id }).first();
        const tags = await knex("tags").where({note_id: id}).orderBy("name");
        return response.json({
            ...note, 
            tags})
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movieNotes").where({ id }).delete();
        return response.json();
    }

    async index(request, response) {
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let notes;
        if(tags !== undefined) {
            if(title == undefined) {
                const filterTags = tags.split(",").map(tag => tag.trim());

                console.log("dbudd")
                
                notes = await knex("tags")
                .select([
                    "movieNotes.id",
                    "movieNotes.title"
                ])
                .where("movieNotes.user_id", user_id)
                .whereIn("name", filterTags)
                .innerJoin("movieNotes", "movieNotes.id", "tags.note_id")

            } else {

                const filterTags = tags.split(",").map(tag => tag.trim());
                
                notes = await knex("tags")
                .select([
                    "movieNotes.id",
                    "movieNotes.title",
                    "movieNotes.rating"
                ])
                .where("movieNotes.user_id", user_id)
                .whereLike("movieNotes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("movieNotes", "movieNotes.id", "tags.note_id")
                .orderBy("movieNotes.title");
            }

        } else {
            console.log("dnv")
           if(title === undefined) {
                notes = await knex("movieNotes")
                .where({ user_id })
                .orderBy("title");
           } else {
            notes = await knex("movieNotes")
                .where({ user_id })
                .whereLike("movieNotes.title", `%${title}%`)
                .orderBy("title");
           }
            
        } 

        const userTags = await knex("tags").where({ user_id });
        const noteWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)
            console.log(noteTags)
            return {
                ...note,
                tags: noteTags
            }
        })
        
        return response.json(noteWithTags)
    }
}

module.exports = NotesControllers;