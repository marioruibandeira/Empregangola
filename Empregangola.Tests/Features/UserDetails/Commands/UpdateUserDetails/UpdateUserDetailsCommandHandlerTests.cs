using Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;
using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Moq;

namespace Empregangola.Tests.Features.UserDetails.Commands.UpdateUserDetails;

public class UpdateUserDetailsCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldUpdateUserDetails_WhenUserExists()
    {
        var repositoryMock = new Mock<IUserDetailsRepository>();

        var existingUser = new UserDetailsTable
        {
            Id = Guid.NewGuid(),
            AppUserId = "user123",
            DateOfBirth = new DateTime(1990, 1, 1),
            Address = "Old Address",
            PostalCode = "0000-000",
            Country = "Old Country",
            Location = "Old Location",
            PhotoProfile = "old.jpg",
            CreatedDate = DateTime.UtcNow
        };

        repositoryMock
            .Setup(r => r.GetByAppUserIdAsync("user123", It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingUser);

        repositoryMock
            .Setup(r => r.UpdateAsync(existingUser, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingUser);

        var handler = new UpdateUserDetailsCommandHandler(repositoryMock.Object);

        var command = new UpdateUserDetailsCommand(
                "user123",
                new DateTime(1995, 5, 5),
                "New Address",
                "1234-567",
                "New Country",
                "New Location",
                "new.jpg"
            );

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal("user123", result.AppUserId);
        Assert.Equal("New Address", result.Address);
        Assert.Equal("1234-567", result.PostalCode);
        Assert.Equal("New Country", result.Country);
        Assert.Equal("New Location", result.Location);
        Assert.Equal("new.jpg", result.PhotoProfile);

        repositoryMock.Verify(r => r.UpdateAsync(existingUser, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenUserNotFound()
    {
        var repositoryMock = new Mock<IUserDetailsRepository>();

        repositoryMock
            .Setup(r => r.GetByAppUserIdAsync("user123", It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserDetailsTable?)null);

        var handler = new UpdateUserDetailsCommandHandler(repositoryMock.Object);

        var command = new UpdateUserDetailsCommand(
            "user123",
            DateTime.UtcNow.AddYears(-20),
            "Address",
            "1234-567",
            "Country",
            "Location",
            "photo.jpg"
        );

        await Assert.ThrowsAsync<Exception>(() =>
        handler.Handle(command, CancellationToken.None));
    }
}
