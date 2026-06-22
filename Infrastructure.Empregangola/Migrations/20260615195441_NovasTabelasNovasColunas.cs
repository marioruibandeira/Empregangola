using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class NovasTabelasNovasColunas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Company",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Company_AppUserId",
                table: "Company",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Company_AspNetUsers_AppUserId",
                table: "Company",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Company_AspNetUsers_AppUserId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_AppUserId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Company");
        }
    }
}
