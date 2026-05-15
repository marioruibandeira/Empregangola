using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class ModificarAEntidade3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "UserDetails");

            migrationBuilder.RenameColumn(
                name: "Names",
                table: "UserDetails",
                newName: "PostalCode");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "UserDetails",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "DialCode",
                table: "UserDetails",
                newName: "Country");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "UserDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "UserDetails");

            migrationBuilder.RenameColumn(
                name: "PostalCode",
                table: "UserDetails",
                newName: "Names");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "UserDetails",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "UserDetails",
                newName: "DialCode");

            migrationBuilder.AddColumn<int>(
                name: "PhoneNumber",
                table: "UserDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
