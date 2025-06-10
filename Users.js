const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'users', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: true, // 컬럼명을 snake_case로 자동 변환 (e.g., firstName -> first_name)
  });

  // 모델 간의 관계를 여기에 정의
  User.associate = (models) => {
    // 예: User.hasMany(models.Post);
  };

  return User;
};