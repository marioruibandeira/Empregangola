using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class TabelaPais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "genero",
                table: "UserDetails",
                newName: "Genero");

            migrationBuilder.CreateTable(
                name: "PaisTable",
                columns: table => new
                {
                    PaidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Pais = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Sigla = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaisTable", x => x.PaidId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaisTable");

            migrationBuilder.RenameColumn(
                name: "Genero",
                table: "UserDetails",
                newName: "genero");
        }
    }
}
