using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository : ILikesRepository
{

    private readonly AppDbContext _context;

    public LikesRepository(AppDbContext context)
    {
        _context = context;
    }

    public void AddLike(MemberLike memberLike)
    {
        _context.Likes.Add(memberLike);
    }

    public void DeleteLike(MemberLike memberLike)
    {
        _context.Likes.Remove(memberLike);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId)
    {
        var likeIds = await _context.Likes
            .Where(like => like.SourceMemberId == memberId)
            .Select(like => like.TargetMemberId)
            .ToListAsync();

        return likeIds;
    }



    public async Task<MemberLike?> GetMemberLikeAsync(string sourceMemberId, string targetMemberId)
    {
        var like = await _context.Likes.FindAsync(sourceMemberId, targetMemberId);
        return like;
    }

    public async Task<PaginatedResult<Member>> GetMemberLikesAsync(LikesParams likesParams)
    {
        var query = _context.Likes.AsQueryable();
        IQueryable<Member> result;
        switch (likesParams.Predicate)
        {
            case "liked":
                query = query.Where(like => like.SourceMemberId == likesParams.CurrentMemberId);
                result = query.Select(like => like.TargetMember).AsNoTracking();
                break;

            case "likedBy":
                query = query.Where(like => like.TargetMemberId == likesParams.CurrentMemberId);
                result = query.Select(like => like.SourceMember).AsNoTracking();
                break;
            default: // mutual likes
                // Get IDs of members that current user has liked
                var likedByCurrentUser = await _context.Likes
                    .Where(like => like.SourceMemberId == likesParams.CurrentMemberId)
                    .Select(like => like.TargetMemberId)
                    .ToListAsync();

                // Get members who liked the current user AND are in the likedByCurrentUser list
                result = _context.Likes
                   .Where(like => like.TargetMemberId == likesParams.CurrentMemberId && likedByCurrentUser.Contains(like.SourceMemberId))
                   .Select(like => like.SourceMember)
                   .AsNoTracking();
                break;

        }
        var resultMembers = PagingHelper.CreateAsync(result, likesParams.PageNumber, likesParams.PageSize);
        return await resultMembers;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
