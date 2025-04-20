import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Interface mandatory attributes
interface CountryAttributes {
  id: number;
  name: string;
  created_at: Date;
}

// Interface to optional attributes (to create)
interface CountryCreationAttributes extends Optional<CountryAttributes, "id" | "created_at"> {}

class Country extends Model<CountryAttributes, CountryCreationAttributes> {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 100],
          msg: "Name must be between 3 and 100 characters",
        },
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "countries",
    timestamps: true, // Habilita timestamps
    createdAt: "created_at",
    updatedAt: false, // Desabilita updatedAt
    deletedAt: "deleted_at",
    indexes: [
      {
        name: "countries_name_idx",
        fields: ["name"],
        unique: true,
      },
    ],
    hooks: {
      beforeCreate: (country: Country) => {
        // Normaliza o nome: primeira letra maiúscula
        if (country.name) {
          country.name = country.name
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      },
      beforeUpdate: (country: Country) => {
        // Reaplica a normalização em atualizações
        if (country.changed("name") && country.name) {
          country.name = country.name
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      },
    },
  },
);

export default Country;
