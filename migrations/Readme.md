Sequelize CLI Commands

Commands:
db:migrate                        Run pending migrations
db:migrate:schema:timestamps:add  Update migration table to have timestamps
db:migrate:status                 List the status of all migrations
db:migrate:undo                   Reverts a migration
db:migrate:undo:all               Revert all migrations ran
db:seed                           Run specified seeder
db:seed:undo                      Deletes data from the database
db:seed:all                       Run every seeder
db:seed:undo:all                  Deletes data from the database
init                              Initializes project
init:config                       Initializes configuration
init:migrations                   Initializes migrations
init:models                       Initializes models
init:seeders                      Initializes seeders
migration:generate                Generates a new migration file       [aliases: migration:create]
model:generate                    Generates a model and its migration  [aliases: model:create]
seed:generate                     Generates a new seed file            [aliases: seed:create]

//optional seed
sequelize db:seed --seed {seeder file name}

Options:
--version  Show version number                                         [boolean]
--help     Show help