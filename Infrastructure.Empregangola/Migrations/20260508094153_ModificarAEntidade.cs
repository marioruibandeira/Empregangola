using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class ModificarAEntidade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "UserDetails");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserDetails");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "UserDetails",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_UserDetails_AppUserId",
                table: "UserDetails",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDetails_AspNetUsers_AppUserId",
                table: "UserDetails",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDetails_AspNetUsers_AppUserId",
                table: "UserDetails");

            migrationBuilder.DropIndex(
                name: "IX_UserDetails_AppUserId",
                table: "UserDetails");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "UserDetails");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "UserDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UserDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
