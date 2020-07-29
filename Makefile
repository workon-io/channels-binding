deploy:
	python3 autotag.py minor
	make pypi_upload
	make push

deploy_medium:
	python3 autotag.py medium
	make pypi_upload
	make push

deploy_major:
	python3 autotag.py major
	make pypi_upload
	make push

push:
	git push
	git push --tags

pypi_upload:
	rm -r dist/*
	python3 setup.py sdist bdist_wheel
	python3 -m twine upload --repository pypi dist/* || echo 'channels-binding is up-to-date'


develop:
	sudo pip3 install .
	python3 setup.py develop --user

undevelop:
	sudo pip uninstall channels-binding 
	
clean:
	find . -type f -name "*.pyc" -delete
	rm -rf nosetests.xml coverage.xml htmlcov *.egg-info *.pdf dist violations.txt

watch:
	sudo watchmedo auto-restart -R -p '*.py' -- make replace

replace:	
	sudo rm -rf /home/dev/tools.hub/api/clearversion/app/channels_binding
	sudo cp -r ./channels_binding /home/dev/tools.hub/api/clearversion/app/channels_binding
	sudo rm -rf /home/dev/tools.hub/api/component/app/channels_binding
	sudo cp -r ./channels_binding /home/dev/tools.hub/api/component/app/channels_binding
	sudo rm -rf /home/dev/edoc/webapp/app/channels_binding
	sudo cp -r ./channels_binding /home/dev/edoc/webapp/app/channels_binding