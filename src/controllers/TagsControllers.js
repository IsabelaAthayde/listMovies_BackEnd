const knex = require('../database/knex');

class TagsControllers {
    async show(request, response) {
        const { note_id } = request.params;

        const tags = await knex("tags").where({note_id}).orderBy("name");
        return response.json(tags)
    }

    // async delete(request, response) {
    //     const { id } = request.params;

    //     await knex("movieTags").where({ id }).delete();
    //     return response.json();
    // }
}

module.exports = TagsControllers;