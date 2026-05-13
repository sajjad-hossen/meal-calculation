using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiTenancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Messes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UniqueCode = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messes", x => x.Id);
                });

            // Seed default mess for existing data
            migrationBuilder.Sql("INSERT INTO \"Messes\" (\"Name\", \"UniqueCode\", \"CreatedAt\") VALUES ('Default Mess', 'DEFAULT', NOW());");

            migrationBuilder.AddColumn<int>(
                name: "MessId",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "MessId",
                table: "Meals",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "MessId",
                table: "Deposits",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "MessId",
                table: "BazarCosts",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Users_MessId",
                table: "Users",
                column: "MessId");

            migrationBuilder.CreateIndex(
                name: "IX_Meals_MessId",
                table: "Meals",
                column: "MessId");

            migrationBuilder.CreateIndex(
                name: "IX_Deposits_MessId",
                table: "Deposits",
                column: "MessId");

            migrationBuilder.CreateIndex(
                name: "IX_BazarCosts_MessId",
                table: "BazarCosts",
                column: "MessId");

            migrationBuilder.AddForeignKey(
                name: "FK_BazarCosts_Messes_MessId",
                table: "BazarCosts",
                column: "MessId",
                principalTable: "Messes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Deposits_Messes_MessId",
                table: "Deposits",
                column: "MessId",
                principalTable: "Messes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_Messes_MessId",
                table: "Meals",
                column: "MessId",
                principalTable: "Messes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Messes_MessId",
                table: "Users",
                column: "MessId",
                principalTable: "Messes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BazarCosts_Messes_MessId",
                table: "BazarCosts");

            migrationBuilder.DropForeignKey(
                name: "FK_Deposits_Messes_MessId",
                table: "Deposits");

            migrationBuilder.DropForeignKey(
                name: "FK_Meals_Messes_MessId",
                table: "Meals");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Messes_MessId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Messes");

            migrationBuilder.DropIndex(
                name: "IX_Users_MessId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Meals_MessId",
                table: "Meals");

            migrationBuilder.DropIndex(
                name: "IX_Deposits_MessId",
                table: "Deposits");

            migrationBuilder.DropIndex(
                name: "IX_BazarCosts_MessId",
                table: "BazarCosts");

            migrationBuilder.DropColumn(
                name: "MessId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MessId",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "MessId",
                table: "Deposits");

            migrationBuilder.DropColumn(
                name: "MessId",
                table: "BazarCosts");
        }
    }
}
