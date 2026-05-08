using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class ModificarAEntidade2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Telefone",
                table: "UserDetails",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "UserDetails",
                newName: "DialCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "UserDetails",
                newName: "Telefone");

            migrationBuilder.RenameColumn(
                name: "DialCode",
                table: "UserDetails",
                newName: "Code");
        }
    }
}
