---
title: Look at me, I am the client now!
date: 2026-10-08 12:00:00 +0700
---

Everyone's crying that SaaS is dead, everyone cooked and there's no UI/UX anymore, just chat. Well... I don't buy it. At least not entirely.

Yes, a lot of workflows are collapsing into text and voice, with the AI acting as a proxy — a UI translator that interprets what you want and executes it by best effort. That part is real.

But I've seen this shift before. When YouTube flooded the internet with DIY tutorials, people started building shit for themselves. Most failed. A few turned it into whole careers. The point isn't the outcome — it's that people started making custom things, for themselves, that fit their needs exactly. Because you can pour endless engineering hours and money into a product trying to serve everyone, and it still won't fit anyone perfectly. The user just bleeds out trying to customize a monster.

## The output of vibecoding is micro-apps

With easy AI access and tooling like skills and agents, people can build digital things for themselves. Fully customized. Super tight scope. And this is the real output of vibecoding: micro, single-purpose apps. Not because people suddenly became engineers, but because people who already know their own problems in their own field can finally build the fix themselves — instead of wrestling with a Goliath suite for weeks and paying a hefty subscription to cover 90% of their needs at best.

Will these micro-apps be better than commercial solutions? Engineering-wise, no. Security-wise… eee. Design? Yes and no. But they're _tailor-made_. And that's the new UI/UX nobody's really talking about.

## The subscription gold fever

The last ten years have been a kind of gold fever. Everyone building on the subscription model, giants migrating to it because it's more stable income than one-time purchases. Microtransactions became the norm. And people eat it.

Five to ten dollars a month has no weight for most modern middle-class families. But multiply that a few times. Ten times. More. Same for professionals. Back then you bought Photoshop and worked with it for years. Now you pay monthly. Even when you don't have work.

So this shift mostly hurts the companies that jumped on the monthly model for simple things — not out of malice, but because the incentives said squeeze. More out of the user base, smoother numbers for the shareholders, a nicer line on the pitch deck. Founders who saw a subscription and thought _recurring revenue_ before they thought _does this thing need to recur._ The gold rush, not the gold diggers.

Why do I need to pay monthly or yearly for a small app that puts a white frame around my photos?

> It's like if my pliers or my screwdrivers stopped working because I didn't pay every month. We're talking about tools.

It doesn't matter if it's digital or physical. Same bullshit argument as digital games you _"buy"_ but don't own.

Let me support you with a single purchase and we say goodbye. Oh, it's more expensive than the _"invisible"_ chipping away at my wallet? Yeah — maybe I'll rethink whether I actually need it.

To be fair: subscriptions make sense for things that actually do something meaningful in the cloud. Processing, generating, hosting at scale. Work that couldn't happen on your laptop, with a real ongoing cost — compute, bandwidth, storage you actually need. That's an ongoing utility bill, and you should pay it.

But there's a difference between a cloud feature that earns its keep and a cloud feature bolted on to justify the meter. Storing my half-written blog posts in markdown on a server for €9.99 a month isn't a utility. It's a hard drive with a login page and no way to opt out.

And then there's the other flavor of the same trick: taking something that used to run perfectly fine on your own machine for years, and moving it to the cloud so the meter can run. Yes, I'm looking at you, Adobe.

And yes, I participated in those projects. Sat in those meetings. Built many dark patterns. I was part of the machine. Not proud of it, in case you wonder.

## The UI layer is the part that changes

This is where it gets interesting. The data infrastructure stays. Nobody's rebuilding Postgres or Stripe or S3. What changes is the **UI layer** — the way we interact with all that infrastructure.

The old model: Swiss Army Knife aggregators. One bloated app that proxies a dozen services, wraps them in a subscription, and serves everyone mediocrely.

The new model: small purpose-made software, often self-hosted, doing one thing exactly right for one person or one team.

I just did this. I had Cloudflare, Umami, and GitHub each tracking different things, each with its own monstrous dashboard, each generating its own noise. So I defined what I actually care about, and when. Now I have a self-hosted dashboard that shows exactly 100% of what I need, refreshing every 8 hours — because that's plenty. I can still go crawl through the complex dashboards if I want. But realistically, I'll just ask my agent when I need something, rather than navigating the labyrinth.

> From the SaaS perspective, the agent became the client and the MCP became the user interface.

When your agent is the one hitting the API, the UI isn't a dashboard or a settings panel. It's the schema, the tool definitions, the permissions. That's what the SaaS company is actually designing for. The human never sees the screen — they see the outcome. Everything else is handled by the user and their agent.

You can spend as long as you want polishing dashboard customization features. If a user can do a custom build in a few hours with AI, they will. I did.

We don't need SaaS to become everything. We need MCP endpoints and scoped tokens from providers. That's it. I don't care about your animated graphs. I have my own.

## The security can of worms

Yes, this opens a huge security question. Agent credentials, scope creep, prompt injection, an agent with write access to your infra and a helpful attitude. Security people are right to be loud.

But the comparison isn't _"agents vs. a perfectly secure system."_ It's _"agents vs. how humans actually operate today."_ Shared passwords in Slack. Tokens nobody rotated since 2022. That one intern with prod access. The bar isn't perfection. It's _better than us_. And we are not a high bar.

The weakest link in security has always been the human. Decades of infosec and it hasn't changed. If you drop API keys into a chat or never ask your agent to perform a security audit because you took it for granted — or worse, never thought it mattered — well, those are human decisions.

Your agent deleted all your data? Well…

Mine noticed I'd wired the prod DB to staging and pulled its own killswitch on a deployment. Not because agents are magic. Because I'd built the guardrail. The agent just didn't get tired.

I'm not claiming my agent is smarter than yours. I'm claiming I wired the killswitch. But I've also spent two decades building for the web, so I pay a bit more attention to the big picture — rather than writing a Reddit post about how Google is cooked because my vibecoded app, still in the oven, killed it. Speed intoxicates. Intoxicated people get sloppy. Sloppy humans get sloppy agents. Simple as that.

## The gatekeeping is gone

With AI, a huge part of the gatekeeping just got demolished. The value is no longer in _"I dare to touch the computer."_ It's in _"I know how to do this properly."_

The waves will quiet down. People will figure out where vibecoded stuff belongs. Some will become better builders. Some will just use it to communicate their idea and their needs to professionals who know how to finish it — which is the same shape as the DIY wave. Some learn the trade. Some hire the tradesperson. The market stratifies.

## So what actually happens

After the DIY video wave, carpenters and electricians and plumbers were still alive. The market just shifted. People pay for comfort. They *could* do it properly themselves, but once the enthusiasm fades and the thing starts feeling like a chore, they hire a professional.

A website or app is different though. Is it? Infrastructure, scaling, UX auditing, accessibility — still things a normal person can't really do even with AI. And yes, AI will keep evolving into a better executor. But it still won't know *what* to do. Only the user knows. And the professionals who help the user figure it out.

SaaS isn't dying. It's splitting.

- The **commodity middle** — the bloated tool trying to be everything for everyone — that's what's dying.
- **Personal agents and micro-apps** eat the low-stakes, single-user, narrow-scope work.
- **High-stakes, high-iteration, high-integration** work consolidates into fewer, sharper professionals, and the SaaS companies that serve them ship MCP endpoints instead of dashboards.

The middle of software is what's dying. Not the ends.

And look at your own week. How many of those dashboards did you actually open — versus just wanting one number?