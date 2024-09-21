'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加新列 newColumn 到表 A
    await queryInterface.addColumn('cases', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // 根据需要设置是否允许为空
      references: {
        model: 'users', // 关联的表 B
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    // 回滚操作，删除新添加的列
    await queryInterface.removeColumn('cases', 'user_id');
  },
};
