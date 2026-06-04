using AtmBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AtmBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new User 
            { 
                UserName = model.Username, 
                FullName = model.FullName, 
                Role = model.Role,
                Email = model.Username
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Пользователь успешно зарегестрирован" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginModel model)
{
    var user = await _userManager.FindByNameAsync(model.Username);
    if (user == null) return BadRequest(new { message = "Пользователь не найден" });

    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

    if (result.Succeeded)
    {
        return Ok(new { 
            username = user.UserName, 
            fullName = user.FullName, 
            role = user.Role 
        });
    }

    return BadRequest(new { message = "Неверный пароль" });
}

// Модель для входа
public class LoginModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
    }
}
