from invoke.tasks import task

@task
def dev(ctx):
    import uvicorn
    uvicorn.run(app="src.main:app", reload=True)