from invoke.tasks import task


@task
def add(ctx, packages):
    ctx.run(f"pip install {packages}")
    ctx.run("pip freeze > requirements.txt")    


@task
def dev(ctx):
    import uvicorn
    uvicorn.run(app="src.main:app", reload=True)