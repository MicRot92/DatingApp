using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController(ILikesRepository likesRepository) : BaseAPIController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();

            if (sourceMemberId == targetMemberId)
            {
                return BadRequest("You cannot like yourself");
            }

            var existingLike = await likesRepository.GetMemberLikeAsync(sourceMemberId, targetMemberId);

            if (existingLike != null)
            {
                likesRepository.DeleteLike(existingLike);
                if (await likesRepository.SaveAllAsync())
                {
                    return Ok();
                }
                else

                {
                    return BadRequest("Failed to unlike member");
                }
            }
            else
            {
                var memberLike = new Entities.MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };

                likesRepository.AddLike(memberLike);

                if (await likesRepository.SaveAllAsync())
                {
                    return Ok();
                }

                return BadRequest("Failed to like member");
            }

        }

        [HttpGet("List")]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetCurrentMemberLikeIds()
        {
            var memberId = User.GetMemberId();
            var members = await likesRepository.GetCurrentMemberLikeIdsAsync(memberId);
            return Ok(members);
        }



        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery] string predicate)
        {
            var memberId = User.GetMemberId();
            var members = await likesRepository.GetMemberLikesAsync(memberId, predicate);
            return Ok(members);
        }

    }
}
