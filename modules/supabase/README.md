# Supabase Module

Drop-in Supabase setup for Next.js App Router with SSR-safe clients.

## Install

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Copy in

Copy `src/` contents into `src/lib/supabase/` of your project:

```
src/lib/supabase/
├── client.ts    # Browser client (use in 'use client' components)
├── server.ts    # Server client (use in Server Components, Route Handlers)
└── admin.ts     # Service-role client (server only - bypasses RLS)
```

## Usage

### In a Server Component

```ts
import { createServerSupabase } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('posts').select();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### In a Client Component

```ts
'use client';
import { createBrowserSupabase } from '@/lib/supabase/client';

const supabase = createBrowserSupabase();
```

### Admin (server-only, bypasses RLS)

```ts
import { createAdminSupabase } from '@/lib/supabase/admin';

const supabase = createAdminSupabase();
// e.g. in a webhook route that needs to write regardless of user
```

## RLS Policy starter

Enable RLS on every public table:

```sql
alter table public.your_table enable row level security;

-- Anyone can read
create policy "read for all" on public.your_table
  for select using (true);

-- Only owner can write
create policy "write own rows" on public.your_table
  for insert with check (auth.uid() = user_id);

create policy "update own rows" on public.your_table
  for update using (auth.uid() = user_id);
```
