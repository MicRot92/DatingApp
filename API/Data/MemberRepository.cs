using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository : IMemberRepository
{
    private readonly AppDbContext _context;

    public MemberRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Upadate(Member member)
    {
        _context.Entry(member).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await _context.Members.ToListAsync();
    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await _context.Members.FindAsync(id);
    }

    public async Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId)
    {
        return await _context.Photos.Where(p => p.MemberId == memberId).ToListAsync();
    }

    public async Task<Member?> GetMemberForUpdateAsync(string id)
    {
        return await _context.Members
        .Include(u => u.User)
        .Include(m => m.Photos)
        .SingleOrDefaultAsync(m => m.Id == id);
    }
}