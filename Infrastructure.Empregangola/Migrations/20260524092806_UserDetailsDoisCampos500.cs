using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class UserDetailsDoisCampos500 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SobreMim",
                table: "UserDetails",
                type: "nvarchar(500)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SobreMim",
                table: "UserDetails",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)");
        }
    }
}
