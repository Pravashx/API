'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(150),
          unique: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM,
          values: ["active", "inactive"],
          defaultValue: "inactive"
        }
      }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("users")
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
